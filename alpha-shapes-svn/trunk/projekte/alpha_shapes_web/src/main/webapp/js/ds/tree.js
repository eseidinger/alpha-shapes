'use strict';

/**
 * A binary tree node with AVL tree balancing methods as described in
 * 'Datenstrukturen und Algorithmen' by Güting and Dieker.
 * 
 * @constructor
 * @param {?} content
 */
function TreeNode(content) {
    /**
     * @type TreeNode
     */
    this.parent = null;
    /**
     * @type TreeNode
     */
    this.leftChild = null;
    /**
     * @type TreeNode
     */
    this.rightChild = null;
    this.content = content;
};

TreeNode.prototype = {
    constructor: TreeNode,
    /**
     * Checks if this node is a leaf.
     * 
     * @returns {boolean} true if it is leaf, false otherwise
     */
    isLeaf: function() {
        return (this.leftChild === null) && (this.rightChild === null);
    },
    /**
     * Checks if this node is a root.
     * 
     * @returns {boolean} true if it is root, false otherwise
     */
    isRoot: function() {
        return this.parent === null;
    },
    /**
     * Checks if this node is a left child.
     * 
     * @returns {boolean} true if it is a left child, false otherwise
     */
    isLeftChild: function() {
        if (this.isRoot()) {
            return false;
        } else {
            return this === this.parent.leftChild;
        }
    },
    /**
     * Check if this node is a right child.
     * 
     * @returns {boolean} true if it is a right child, false otherwise
     */
    isRightChild: function() {
        if (this.isRoot()) {
            return false;
        } else {
            return this === this.parent.rightChild;
        }
    },
    /**
     * Checks if this tree node has a given node in its left subtree.
     * 
     * @param {TreeNode} node to look for in left subtree
     * @returns {boolean} true if node is contained, false otherwise
     */
    hasInLeftSubtree: function(node) {
        var result = false;
        if (this.leftChild !== null) {
            this.leftChild.inorderDo(function(testNode) {
                if (node === testNode) {
                    result = true;
                }
            });
        }
        return result;
    },
    /**
     * Checks if this tree node has a given node in its right subtree.
     * 
     * @param {TreeNode} node to look for in right subtree
     * @returns {boolean} true if node is contained, false otherwise
     */
    hasInRightSubtree: function(node) {
        var result = false;
        if (this.rightChild !== null) {
            this.rightChild.inorderDo(function(testNode) {
                if (node === testNode) {
                    result = true;
                }
            });
        }
        return result;
    },
    /**
     * Sets this nodes left child and the child's parent.
     * 
     * @param {TreeNode} node to add as left child
     */
    setLeftChild: function(node) {
        this.leftChild = node;
        node.parent = this;
    },
    /**
     * Sets this nodes right child and the child's parent.
     * 
     * @param {TreeNode} node to add as right child
     */
    setRightChild: function(node) {
        this.rightChild = node;
        node.parent = this;
    },
    /**
     * Get string representation of this tree node's content.
     * 
     * @returns {String} string representation of content
     */
    toString: function() {
        return this.content.toString();
    },
    /**
     * Get string representation of this tree node's subtree in inorder order.
     * 
     * @returns {string}
     */
    inorderString: function() {
        var result = '';
        if (this.leftChild !== null) {
            result += this.leftChild.inorderString();
        }
        result += this.toString();
        if (this.rightChild !== null) {
            result += this.rightChild.inorderString();
        }
        return result;
    },
    /**
     * Get an array of this tree node's subtree's tree nodes in inorder order.
     * 
     * @returns {Array.<TreeNode>}
     */
    inorderList: function() {
        var result = [];
        if (this.leftChild !== null) {
            result = result.concat(this.leftChild.inorderList());
        }
        result.push(this);
        if (this.rightChild !== null) {
            result = result.concat(this.rightChild.inorderList());
        }
        return result;
    },
    /**
     * Execute a given function on every tree node in this tree node's subtree
     * in inorder order.
     * 
     * @private
     * @param {function(TreeNode)} fct to execute on tree nodes
     */
    inorderDo: function(fct) {
        if (this.leftChild !== null) {
            this.leftChild.inorderDo(fct);
        }
        fct(this);
        if (this.rightChild !== null) {
            this.rightChild.inorderDo(fct);
        }
    },
    /**
     * Get depth of this tree node's subtree.
     * 
     * @private
     * @returns {number} depth of subtree
     */
    getDepth: function() {
        var leftDepth = 0;
        var rightDepth = 0;
        if (this.leftChild !== null) {
            leftDepth = this.leftChild.getDepth();
        }
        if (this.rightChild !== null) {
            rightDepth = this.rightChild.getDepth();
        }
        return 1 + Math.max(rightDepth, leftDepth);
    },
    /**
     * Calculate the balance of this tree node's subtree.
     * 
     * @private
     * @returns {number}
     */
    getBalance: function() {
        var leftDepth = 0;
        var rightDepth = 0;
        if (this.leftChild !== null) {
            leftDepth = this.leftChild.getDepth();
        }
        if (this.rightChild !== null) {
            rightDepth = this.rightChild.getDepth();
        }
        return leftDepth - rightDepth;
    },
    /**
     * Check balance of this tree node's subtree and rebalance if necessary.
     */
    checkBalance: function() {
        if (Math.abs(this.getBalance()) >= 2) {
            this.rebalance();
        }
    },
    /**
     * Checks balance of this tree node's subtree and the balance of all
     * ancestors up to the root.
     */
    checkBalanceUpToRoot: function() {
        this.checkBalance();
        if (!this.isRoot()) {
            this.parent.checkBalanceUpToRoot();
        }
    },
    /**
     * Rebalance this tree node's subtree.
     * 
     * @private
     */
    rebalance: function() {
        if (this.getBalance() < 0) {
            if (this.rightChild.getBalance() < 0) {
                this.rotateLeft();
            } else {
                this.rightChild.rotateRight();
                this.rotateLeft();
            }
        } else {
            if (this.leftChild.getBalance() > 0) {
                this.rotateRight();
            } else {
                this.leftChild.rotateLeft();
                this.rotateRight();
            }
        }
    },
    /**
     * Perform a rotation to the left as described by Güting.
     * 
     * @private
     */
    rotateLeft: function() {
        this.swapContents(this.rightChild);
        this.swapChildren();
        this.leftChild.swapChildren();
        this.swapTrees('left');
    },
    /**
     * Perform a rotation to the right as described by Güting.
     * 
     * @private
     */
    rotateRight: function() {
        this.swapContents(this.leftChild);
        this.swapChildren();
        this.rightChild.swapChildren();
        this.swapTrees('right');
    },
    /**
     * Swap contents of this tree node and a given tree node.
     * 
     * @private
     * @param {TreeNode} treeNode
     */
    swapContents: function(treeNode) {
        var temp = treeNode.content;
        treeNode.content = this.content;
        this.content = temp;
    },
    /**
     * Exchange left and right child.
     * 
     * @private
     */
    swapChildren: function() {
        var temp = this.rightChild;
        this.rightChild = this.leftChild;
        this.leftChild = temp;
    },
    /**
     * Last step in sub tree rotation.
     * 
     * @private
     * @param {string} direction of rotation
     */
    swapTrees: function(direction) {
        if (direction === 'left') {
            var temp = this.rightChild;
            this.setRightChild(this.leftChild.leftChild);
            this.leftChild.setLeftChild(temp);
        } else {
            temp = this.leftChild;
            this.setLeftChild(this.rightChild.rightChild);
            this.rightChild.setRightChild(temp);
        }
    }
};

/**
 * A binary tree.
 * 
 * @constructor
 */
function Tree() {
    /**
     * @type TreeNode
     */
    this.root = null;
};

Tree.prototype = {
    constructor: Tree,
    /**
     * Check if tree is empty.
     * 
     * @returns {boolean} true if tree is empty, false otherwise
     */
    isEmpty: function() {
        return this.root === null;
    },
    /**
     * Replace a tree node with another tree node.
     * 
     * @param {TreeNode} oldNode to replace
     * @param {TreeNode} newNode replacement
     */
    replaceNode: function(oldNode, newNode) {
        if (oldNode.isRoot()) {
            this.root = newNode;
        } else if (oldNode.isLeftChild()) {
            oldNode.parent.setLeftChild(newNode);
        } else if (oldNode.isRightChild()) {
            oldNode.parent.setRightChild(newNode);
        }
    },
    /**
     * Give a string representation of this tree in inorder order.
     * 
     * @returns {string}
     */
    toString: function() {
        return this.root.inorderString();
    },
    /**
     * Give a list of tree nodes of this tree in inorder list.
     * 
     * @returns {Array.<TreeNode>}
     */
    inorderList: function() {
        return this.root.inorderList();
    },
    /**
     * Perform a given function on all tree nodes of this tree in inorder order.
     * 
     * @param {function(TreeNode)} fct to perform
     */
    inorderDo: function(fct) {
        if (this.root !== null) {
            this.root.inorderDo(fct);
        }
    },
    /**
     * Give first common ancestor of two given tree nodes.
     * 
     * @param {TreeNode} node1 first node to check for common ancestor
     * @param {TreeNode} node2 second node to check for common ancestor
     * @returns {TreeNode}
     */
    getCommonAncestor: function(node1, node2) {
        var currentNode1 = node1.parent;
        while (currentNode1 !== null) {
            var currentNode2 = node2.parent;
            while (currentNode2 !== null) {
                if (currentNode2 === currentNode1) {
                    return currentNode1;
                } else {
                    currentNode2 = currentNode2.parent;
                }
            }
            currentNode1 = currentNode1.parent;
        }
        return null;
    }
};

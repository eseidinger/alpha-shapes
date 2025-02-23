/**
 Copyright 2013-2014 Emanuel Seidinger

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

'use strict';

(function(ds) {
    /**
     * A binary tree node with AVL tree balancing methods as described in
     * 'Datenstrukturen und Algorithmen' by Güting and Dieker.
     *
     * @param {?} content
     * @constructor
     */
    alphashape.ds.TreeNode = function(content) {
        /**
         * @type {alphashape.ds.TreeNode}
         */
        this.leftChild = null;
        /**
         * @type {alphashape.ds.TreeNode}
         */
        this.rightChild = null;
        /**
         * @type {?}
         */
        this.content = content;
    };

    alphashape.ds.TreeNode.prototype = {
        constructor: ds.TreeNode,
        /**
         * Get string representation of this tree node's content.
         *
         * @returns {string} string representation of content
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
            this.inorderDo(function(node) {result += node.toString()});
            return result;
        },
        /**
         * Get an array of this tree node's subtree's contents in inorder order.
         *
         * @returns {Array}
         */
        inorderList: function() {
            var result = [];
            this.inorderDo(function(content) {result.push(content)});
            return result;
        },
        /**
         * Execute a given function on every tree node's content in this tree node's subtree
         * in inorder order.
         *
         * @param {function(?)} fct to execute on tree nodes
         */
        inorderDo: function(fct) {
            if (this.leftChild !== null) {
                this.leftChild.inorderDo(fct);
            }
            fct(this.content);
            if (this.rightChild !== null) {
                this.rightChild.inorderDo(fct);
            }
        },
        /**
         * Checks if this node is a leaf.
         *
         * @private
         * @returns {boolean} true if it is leaf, false otherwise
         */
        isLeaf: function() {
            return (this.leftChild === null) && (this.rightChild === null);
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
         * Check balance of a subtree of a node of this tree rebalance if necessary.
         *
         * @private
         */
        checkBalance: function() {
            if (Math.abs(this.getBalance()) >= 2) {
                return this.rebalance();
            } else {
                return this;
            }
        },
        /**
         * Rebalance a subtree of a node of this tree.
         *
         * @private
         */
        rebalance: function() {
            if (this.getBalance() < 0) {
                if (this.rightChild.getBalance() >= 0) {
                    this.rightChild = this.rightChild.rotateRight();
                }
                return this.rotateLeft();
            } else {
                if (this.leftChild.getBalance() <= 0) {
                    this.leftChild = this.leftChild.rotateLeft();
                }
                return this.rotateRight();
            }
        },
        /**
         * Perform a rotation to the left of a node of this tree as described by Güting.
         *
         * @private
         */
        rotateLeft: function() {
            var temp = this.rightChild;
            this.rightChild = temp.leftChild;
            temp.leftChild = this;
            return temp;
        },
        /**
         * Perform a rotation to the right of a node of this tree as described by Güting.
         *
         * @private
         */
        rotateRight: function() {
            var temp = this.leftChild;
            this.leftChild = temp.rightChild;
            temp.rightChild = this;
            return temp;
        },
        /**
         * Find an element in this node's subtree using an optional comparator. If no exact match is found, null
         * is returned.
         *
         * @param {*} element
         * @param {function(?, ?): number} comparator
         * @returns {*}
         */
        get: function(element, comparator) {
            if (comparator === undefined) {
                if (element.compareTo === undefined) {
                    return null;
                } else {
                    comparator = function(el1, el2) { return el1.compareTo(el2); };
                }
            }
            var comp = comparator(element, this.content);
            if (comp === 0) {
                return this.content;
            } else if (comp === -1) {
                if (this.leftChild === null) {
                    return null;
                }
                return this.leftChild.get(element, comparator);
            } else {
                if (this.rightChild === null) {
                    return null;
                }
                return this.rightChild.get(element, comparator);
            }
        },
        /**
         * Find an element in this node's subtree using an optional comparator. If no exact match is found, the
         * closest element is returned.
         *
         * @param {*} element
         * @param {function(?, ?): number} comparator
         * @returns {*}
         */
        getClosest: function(element, comparator) {
            if (comparator === undefined) {
                if (element.compareTo === undefined) {
                    return null;
                } else {
                    comparator = function(el1, el2) { return el1.compareTo(el2); };
                }
            }
            var comp = comparator(element, this.content);
            if (comp === 0) {
                return this.content;
            } else if (comp === -1) {
                if (this.leftChild === null) {
                    return this.content;
                }
                return this.leftChild.getClosest(element, comparator);
            } else {
                if (this.rightChild === null) {
                    return this.content;
                }
                return this.rightChild.getClosest(element, comparator);
            }
        },
        /**
         * Insert an element in this node's subtree using an optional comparator.
         *
         * @param {*} element
         * @param {function(?, ?): number} comparator
         * @returns {alphashape.ds.TreeNode} balanced root of subtree
         */
        insert: function(element, comparator) {
            if (comparator === undefined) {
                if (element.compareTo === undefined) {
                    return null;
                } else {
                    comparator = function(el1, el2) { return el1.compareTo(el2); };
                }
            }
            if (comparator(element, this.content) !== 1) {
                if (this.leftChild !== null) {
                    this.leftChild = this.leftChild.insert(element, comparator);
                } else {
                    var newNode = new ds.TreeNode(element);
                    this.leftChild = newNode;
                }
            } else {
                if (this.rightChild !== null) {
                    this.rightChild = this.rightChild.insert(element, comparator);
                } else {
                    newNode = new ds.TreeNode(element);
                    this.rightChild = newNode;
                }
            }
            return this.checkBalance();
        },
        /**
         * Deletes the minimum of this node's subtree.
         *
         * @private
         * @returns {*} minimum content of this subtree
         */
        deleteMin: function() {
            if (this.leftChild === null) {
                var result = this.content;
                if (this.rightChild !== null) {
                    this.content = this.rightChild.deleteMin();
                    if (this.rightChild.content === null) {
                        this.rightChild = null;
                    }
                } else {
                    this.content = null;
                }
            } else {
                result = this.leftChild.deleteMin();
                if (this.leftChild.content === null) {
                    this.leftChild = this.leftChild.rightChild;
                }
            }
            return result;
        },
        /**
         * Delete an element in this node's subtree using an optional comparator.
         *
         * @param {*} element
         * @param {function(?, ?): number} comparator
         * @returns {alphashape.ds.TreeNode} balanced root of subtree
         */
        deleteElement: function(element, comparator) {
            if (comparator === undefined) {
                if (element.compareTo === undefined) {
                    return null;
                } else {
                    comparator = function(el1, el2) { return el1.compareTo(el2); };
                }
            }
            var comp = comparator(element, this.content);
            if (comp === -1) {
                if (this.leftChild !== null) {
                    this.leftChild = this.leftChild.deleteElement(element, comparator);
                }
                return this.checkBalance();
            } else if (comp === 1) {
                if (this.rightChild !== null) {
                    this.rightChild = this.rightChild.deleteElement(element, comparator);
                }
                return this.checkBalance();
            } else {
                if ((this.leftChild === null) && (this.rightChild === null)) {
                    return null;
                } else if (this.leftChild === null) {
                    return this.rightChild.checkBalance();
                } else if (this.rightChild === null) {
                    return this.leftChild.checkBalance();
                } else {
                    this.content = this.rightChild.deleteMin();
                    if (this.rightChild.content === null) {
                        this.rightChild = null;
                    }
                    return this.checkBalance();
                }
            }
        }
    };

    /**
     * A binary tree.
     *
     * @constructor
     */
    alphashape.ds.Tree = function() {
        /**
         * @type alphashape.ds.TreeNode
         */
        this.root = null;
    };

    alphashape.ds.Tree.prototype = {
        constructor: ds.Tree,
        /**
         * Check if tree is empty.
         *
         * @returns {boolean} true if tree is empty, false otherwise
         */
        isEmpty: function() {
            return this.root === null;
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
         * Give a list of tree nodes' contents in inorder list.
         *
         * @returns {Array}
         */
        inorderList: function() {
            return this.root.inorderList();
        },
        /**
         * Perform a given function on all tree nodes' contents in inorder order.
         *
         * @param {function(?)} fct to perform
         */
        inorderDo: function(fct) {
            if (this.root !== null) {
                this.root.inorderDo(fct);
            }
        },
        /**
         * Get an element in this tree using an optional comparator. If no exact match is found, null is returned.
         *
         * @param {*} element
         * @param {function(?,?): number} comparator
         * @returns {*}
         */
        get: function(element, comparator) {
            if (this.isEmpty()){
                return null;
            } else {
                return this.root.get(element, comparator);
            }
        },
        /**
         * Get an element in this tree using an optional comparator. If no exact match is found, the closest element
         * is returned.
         *
         * @param {*} element
         * @param {function(?,?): number} comparator
         * @returns {*}
         */
        getClosest: function(element, comparator) {
            if (this.isEmpty()){
                return null;
            } else {
                return this.root.getClosest(element, comparator);
            }
        },
        /**
         * Insert an element in this tree using an optional comparator.
         *
         * @param {*} element
         * @param {function(?,?): number} comparator
         */
        insert: function(element, comparator) {
            if (this.isEmpty()) {
                this.root = new ds.TreeNode(element);
            } else {
                this.root = this.root.insert(element, comparator);
            }
        },
        /**
         * Delete an element in this tree using an optional comparator.
         *
         * @param {*} element
         * @param {function(?,?): number} comparator
         */
        deleteElement: function(element, comparator) {
            if (!this.isEmpty()) {
                this.root = this.root.deleteElement(element, comparator);
            }
        },
        /**
         * Deletes and returns the minimum of this tree.
         *
         * @returns {*} minimum content of this tree
         */
        deleteMin: function() {
            if (this.isEmpty()) {
                return null;
            } else {
                var result = this.root.deleteMin();
                if (this.root.content === null) {
                    this.root = null;
                }
                return result;
            }
        }
    };
})(alphashape.ds);

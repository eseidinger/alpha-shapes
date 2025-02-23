'use strict';

var Tree = alphashape.ds.Tree;
var TreeNode = alphashape.ds.TreeNode;

describe('TreeNode', function() {

    it('checks whether it is a leaf or not', function() {
        var root = new TreeNode(null);
        var leftLeaf = new TreeNode(null);
        var rightLeaf = new TreeNode(null);

        root.setLeftChild(leftLeaf);
        root.setRightChild(rightLeaf);

        expect(root.isLeaf()).toBe(false);
        expect(leftLeaf.isLeaf()).toBe(true);
        expect(rightLeaf.isLeaf()).toBe(true);
    });

    it('checks whether it is the root or not', function() {
        var root = new TreeNode(null);
        var leftLeaf = new TreeNode(null);
        var rightLeaf = new TreeNode(null);

        root.setLeftChild(leftLeaf);
        root.setRightChild(rightLeaf);

        expect(root.isRoot()).toBe(true);
        expect(leftLeaf.isRoot()).toBe(false);
        expect(rightLeaf.isRoot()).toBe(false);
    });

    it('checks whether it is a left or a right child', function() {
        var root = new TreeNode(null);
        var leftLeaf = new TreeNode(null);
        var rightLeaf = new TreeNode(null);

        root.setLeftChild(leftLeaf);
        root.setRightChild(rightLeaf);

        expect(leftLeaf.isLeftChild()).toBe(true);
        expect(leftLeaf.isRightChild()).toBe(false);
        expect(rightLeaf.isLeftChild()).toBe(false);
        expect(rightLeaf.isRightChild()).toBe(true);
    });

    it('checks whether it has a specific node in a subtree', function() {
        var root = new TreeNode(null);
        var leftLeaf = new TreeNode(null);
        var rightLeaf = new TreeNode(null);

        root.setLeftChild(leftLeaf);
        root.setRightChild(rightLeaf);

        expect(root.hasInLeftSubtree(leftLeaf)).toBe(true);
        expect(root.hasInRightSubtree(rightLeaf)).toBe(true);
        expect(root.hasInLeftSubtree(rightLeaf)).toBe(false);
        expect(root.hasInRightSubtree(leftLeaf)).toBe(false);
    });

    it('returns a string representation of its contents', function() {
        var node = new TreeNode({toString: function() { return 'hi'}});
        expect(node.toString()).toBe('hi');
    });

    it('executes a function inorder on its subtree nodes', function() {
        var root = new TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new TreeNode({toString: function() { return 'right'}});

        root.setLeftChild(leftLeaf);
        root.setRightChild(rightLeaf);

        var result = '';
        root.inorderDo(function(node) {result += node.toString()});
        expect(result).toBe('leftrootright');
    });

    it('returns an inorder string representation of its subtree nodes', function() {
        var root = new TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new TreeNode({toString: function() { return 'right'}});

        root.setLeftChild(leftLeaf);
        root.setRightChild(rightLeaf);

        expect(root.inorderString()).toBe('leftrootright');
    });

    it('returns an inorder list of its subtree nodes', function() {
        var root = new TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new TreeNode({toString: function() { return 'right'}});

        root.setLeftChild(leftLeaf);
        root.setRightChild(rightLeaf);

        var inorderList = root.inorderList();

        expect(inorderList[0]).toBe(leftLeaf);
        expect(inorderList[1]).toBe(root);
        expect(inorderList[2]).toBe(rightLeaf);
    });

    it('checks its balance and rebalances with a single right rotation', function() {
        var root = new TreeNode(null);
        var left = new TreeNode(null);
        var leftLeft = new TreeNode(null);

        left.setLeftChild(leftLeft);
        root.setLeftChild(left);

        root.checkBalance();

        expect(root.leftChild).toBe(leftLeft);
        expect(root.rightChild).toBe(left);
    });

    it('checks its balance and rebalances with a single right rotation (case 2)', function() {
        var root = new TreeNode(null);
        var left = new TreeNode(null);
        var leftRight = new TreeNode(null);

        left.setRightChild(leftRight);
        root.setLeftChild(left);

        root.checkBalance();

        expect(root.leftChild).toBe(leftRight);
        expect(root.rightChild).toBe(left);
    });

    it('checks its balance and rebalances with a single left rotation', function() {
        var root = new TreeNode(null);
        var right = new TreeNode(null);
        var rightRight = new TreeNode(null);

        right.setRightChild(rightRight);
        root.setRightChild(right);

        root.checkBalance();

        expect(root.leftChild).toBe(right);
        expect(root.rightChild).toBe(rightRight);
    });

    it('checks its balance and rebalances with a single left rotation (case 2)', function() {
        var root = new TreeNode(null);
        var right = new TreeNode(null);
        var rightLeft = new TreeNode(null);

        right.setLeftChild(rightLeft);
        root.setRightChild(right);

        root.checkBalance();

        expect(root.leftChild).toBe(right);
        expect(root.rightChild).toBe(rightLeft);
    });

    it('checks its balance and rebalances with a left-right double rotation', function() {
        var x = new TreeNode('x');
        var a = new TreeNode('a');
        a.setLeftChild(new TreeNode('a_left'));
        a.setRightChild(new TreeNode('a_right'));
        x.setLeftChild(a);
        var z = new TreeNode('z');
        x.setRightChild(z);
        var y = new TreeNode('y');
        z.setLeftChild(y);
        var b1 = new TreeNode('b1');
        b1.setLeftChild(new TreeNode('b1_left'));
        b1.setRightChild(new TreeNode('b1_right'));
        y.setLeftChild(b1);
        var b2 = new TreeNode('b2');
        y.setRightChild(b2);
        var c = new TreeNode('c');
        c.setLeftChild(new TreeNode('c_left'));
        c.setRightChild(new TreeNode('c_right'));
        z.setRightChild(c);

        x.checkBalance();

        var newY = x;
        var newX = newY.leftChild;
        var newZ = newY.rightChild;
        var newA = newX.leftChild;
        var newB1 = newX.rightChild;
        var newB2 = newZ.leftChild;
        var newC = newZ.rightChild;
        expect(newY.toString()).toBe('y');
        expect(newX.toString()).toBe('x');
        expect(newZ.toString()).toBe('z');
        expect(newB1.toString()).toBe('b1');
        expect(newB1.leftChild.toString()).toBe('b1_left');
        expect(newB1.rightChild.toString()).toBe('b1_right');
        expect(newB2.toString()).toBe('b2');
        expect(newC.toString()).toBe('c');
        expect(newC.leftChild.toString()).toBe('c_left');
        expect(newC.rightChild.toString()).toBe('c_right');
    });

    it('checks its balance and rebalances with a left-right double rotation (case 2)', function() {
        var x = new TreeNode('x');
        var a = new TreeNode('a');
        a.setLeftChild(new TreeNode('a_left'));
        a.setRightChild(new TreeNode('a_right'));
        x.setLeftChild(a);
        var z = new TreeNode('z');
        x.setRightChild(z);
        var y = new TreeNode('y');
        z.setLeftChild(y);
        var b1 = new TreeNode('b1');
        y.setLeftChild(b1);
        var b2 = new TreeNode('b2');
        b2.setLeftChild(new TreeNode('b2_left'));
        b2.setRightChild(new TreeNode('b2_right'));
        y.setRightChild(b2);
        var c = new TreeNode('c');
        c.setLeftChild(new TreeNode('c_left'));
        c.setRightChild(new TreeNode('c_right'));
        z.setRightChild(c);

        x.checkBalance();

        var newY = x;
        var newX = newY.leftChild;
        var newZ = newY.rightChild;
        var newA = newX.leftChild;
        var newB1 = newX.rightChild;
        var newB2 = newZ.leftChild;
        var newC = newZ.rightChild;
        expect(newY.toString()).toBe('y');
        expect(newX.toString()).toBe('x');
        expect(newZ.toString()).toBe('z');
        expect(newB1.toString()).toBe('b1');
        expect(newB2.toString()).toBe('b2');
        expect(newB2.leftChild.toString()).toBe('b2_left');
        expect(newB2.rightChild.toString()).toBe('b2_right');
        expect(newC.toString()).toBe('c');
        expect(newC.leftChild.toString()).toBe('c_left');
        expect(newC.rightChild.toString()).toBe('c_right');
    });
});

describe('Tree', function() {
    it('checks whether it is empty or not', function() {
        var tree = new Tree();

        expect(tree.isEmpty()).toBe(true);
        tree.root = new TreeNode(null);
        expect(tree.isEmpty()).toBe(false);
    });

    it('replaces a tree node with another tree node', function() {
        var tree = new Tree();
        var root = new TreeNode();
        var left = new TreeNode();
        var right = new TreeNode();
        tree.root = root;
        root.setLeftChild(left);
        root.setRightChild(right);

        var newLeft = new TreeNode();
        var newRoot = new TreeNode();

        tree.replaceNode(left, newLeft);
        expect(root.leftChild).toBe(newLeft);
        expect(newLeft.parent).toBe(root);
        tree.replaceNode(root, newRoot);
        expect(tree.root).toBe(newRoot);
    });

    it('returns an inorder string representation of its tree nodes', function() {
        var tree = new Tree();
        var root = new TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new TreeNode({toString: function() { return 'right'}});

        root.setLeftChild(leftLeaf);
        root.setRightChild(rightLeaf);
        tree.root = root;

        expect(tree.toString()).toBe('leftrootright');
    });

    it('returns an inorder list of its tree nodes', function() {
        var tree = new Tree();
        var root = new TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new TreeNode({toString: function() { return 'right'}});

        tree.root = root;
        root.setLeftChild(leftLeaf);
        root.setRightChild(rightLeaf);

        var inorderList = tree.inorderList();

        expect(inorderList[0]).toBe(leftLeaf);
        expect(inorderList[1]).toBe(root);
        expect(inorderList[2]).toBe(rightLeaf);
    });

    it('executes a function inorder on its tree nodes', function() {
        var tree = new Tree();
        var root = new TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new TreeNode({toString: function() { return 'right'}});

        tree.root = root;
        root.setLeftChild(leftLeaf);
        root.setRightChild(rightLeaf);

        var result = '';
        tree.inorderDo(function(node) {result += node.toString()});
        expect(result).toBe('leftrootright');
    });

    it('returns the common ancestor of two given tree nodes', function() {
        var tree = new Tree();
        var root = new TreeNode();
        var left = new TreeNode();
        var right = new TreeNode();
        tree.root = root;
        root.setLeftChild(left);
        root.setRightChild(right);

        var commonAncestor = tree.getCommonAncestor(left, right);

        expect(commonAncestor).toBe(root);
    });
});

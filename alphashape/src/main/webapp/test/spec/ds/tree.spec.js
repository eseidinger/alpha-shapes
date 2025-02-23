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

describe('TreeNode', function() {

    var ds = alphashape.ds;

    it('checks whether it is a leaf or not', function() {
        var root = new ds.TreeNode(null);
        var leftLeaf = new ds.TreeNode(null);
        var rightLeaf = new ds.TreeNode(null);

        root.leftChild = leftLeaf;
        root.rightChild = rightLeaf;

        expect(root.isLeaf()).toBe(false);
        expect(leftLeaf.isLeaf()).toBe(true);
        expect(rightLeaf.isLeaf()).toBe(true);
    });

    it('returns a string representation of its contents', function() {
        var node = new ds.TreeNode({toString: function() { return 'hi'}});
        expect(node.toString()).toBe('hi');
    });

    it('executes a function inorder on its subtree nodes contents', function() {
        var root = new ds.TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new ds.TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new ds.TreeNode({toString: function() { return 'right'}});

        root.leftChild = leftLeaf;
        root.rightChild = rightLeaf;

        var result = '';
        root.inorderDo(function(node) {result += node.toString()});
        expect(result).toBe('leftrootright');
    });

    it('returns an inorder string representation of its subtree nodes', function() {
        var root = new ds.TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new ds.TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new ds.TreeNode({toString: function() { return 'right'}});

        root.leftChild = leftLeaf;
        root.rightChild = rightLeaf;

        expect(root.inorderString()).toBe('leftrootright');
    });

    it('returns an inorder list of its subtree nodes', function() {
        var root = new ds.TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new ds.TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new ds.TreeNode({toString: function() { return 'right'}});

        root.leftChild = leftLeaf;
        root.rightChild = rightLeaf;

        var inorderList = root.inorderList();

        expect(inorderList[0].toString()).toBe('left');
        expect(inorderList[1].toString()).toBe('root');
        expect(inorderList[2].toString()).toBe('right');
    });

    it('checks its balance and rebalances with a single right rotation', function() {
        var root = new ds.TreeNode('root');
        var left = new ds.TreeNode('left');
        var leftLeft = new ds.TreeNode('leftLeft');

        left.leftChild = leftLeft;
        root.leftChild = left;

        root = root.checkBalance();

        expect(root.content).toBe('left');
        expect(root.leftChild.content).toBe('leftLeft');
        expect(root.rightChild.content).toBe('root');
    });

    it('checks its balance and rebalances with a left-right double rotation', function() {
        var root = new ds.TreeNode('root');
        var left = new ds.TreeNode('left');
        var leftRight = new ds.TreeNode('leftRight');

        left.rightChild = leftRight;
        root.leftChild = left;

        root = root.checkBalance();

        expect(root.content).toBe('leftRight');
        expect(root.leftChild.content).toBe('left');
        expect(root.rightChild.content).toBe('root');
    });

    it('checks its balance and rebalances with a single left rotation', function() {
        var root = new ds.TreeNode('root');
        var right = new ds.TreeNode('right');
        var rightRight = new ds.TreeNode('rightRight');

        right.rightChild = rightRight;
        root.rightChild = right;

        root = root.checkBalance();

        expect(root.content).toBe('right');
        expect(root.leftChild.content).toBe('root');
        expect(root.rightChild.content).toBe('rightRight');
    });

    it('checks its balance and rebalances with a right-left double rotation', function() {
        var root = new ds.TreeNode('root');
        var right = new ds.TreeNode('right');
        var rightLeft = new ds.TreeNode('rightLeft');

        right.leftChild = rightLeft;
        root.rightChild = right;

        root = root.checkBalance();

        expect(root.content).toBe('rightLeft');
        expect(root.leftChild.content).toBe('root');
        expect(root.rightChild.content).toBe('right');
    });
});

describe('Tree', function() {

    var ds = alphashape.ds;
    var util = alphashape.util;

    it('checks whether it is empty or not', function() {
        var tree = new ds.Tree();

        expect(tree.isEmpty()).toBe(true);
        tree.root = new ds.TreeNode(null);
        expect(tree.isEmpty()).toBe(false);
    });

    it('returns an inorder string representation of its tree nodes contents', function() {
        var tree = new ds.Tree();
        var root = new ds.TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new ds.TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new ds.TreeNode({toString: function() { return 'right'}});

        root.leftChild = leftLeaf;
        root.rightChild = rightLeaf;
        tree.root = root;

        expect(tree.toString()).toBe('leftrootright');
    });

    it('returns an inorder list of its tree nodes contents', function() {
        var tree = new ds.Tree();
        var root = new ds.TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new ds.TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new ds.TreeNode({toString: function() { return 'right'}});

        tree.root = root;
        root.leftChild = leftLeaf;
        root.rightChild = rightLeaf;

        var inorderList = tree.inorderList();

        expect(inorderList[0].toString()).toBe('left');
        expect(inorderList[1].toString()).toBe('root');
        expect(inorderList[2].toString()).toBe('right');
    });

    it('executes a function inorder on its tree nodes contents', function() {
        var tree = new ds.Tree();
        var root = new ds.TreeNode({toString: function() { return 'root'}});
        var leftLeaf = new ds.TreeNode({toString: function() { return 'left'}});
        var rightLeaf = new ds.TreeNode({toString: function() { return 'right'}});

        tree.root = root;
        root.leftChild = leftLeaf;
        root.rightChild = rightLeaf;

        var result = '';
        tree.inorderDo(function(node) {result += node.toString()});
        expect(result).toBe('leftrootright');
    });

    it('inserts elements and keeps itself balanced', function() {
        var compFunction = util.comparator.compare;
        var compMethod = function(el) {return compFunction(this.val, el.val);};
        var objs = [{val: 0}, {val: 1}, {val: 2}];
        objs.forEach(function(el) {el.compareTo = compMethod});

        var tree1 = new ds.Tree();
        tree1.insert(0, compFunction);
        tree1.insert(1, compFunction);
        tree1.insert(2, compFunction);

        expect(tree1.root.content).toBe(1);
        expect(tree1.root.leftChild.content).toBe(0);
        expect(tree1.root.rightChild.content).toBe(2);

        var tree2 = new ds.Tree();
        tree2.insert(objs[0]);
        tree2.insert(objs[1]);
        tree2.insert(objs[2]);

        expect(tree2.root.content).toBe(objs[1]);
        expect(tree2.root.leftChild.content).toBe(objs[0]);
        expect(tree2.root.rightChild.content).toBe(objs[2]);
    });

    it('deletes elements and keeps itself balanced', function() {
        var compFunction = util.comparator.compare;
        var compMethod = function(el) {return compFunction(this.val, el.val);};
        var objs = [{val: 0}, {val: 1}, {val: 2}, {val: 3}];
        objs.forEach(function(el) {el.compareTo = compMethod});

        var tree1 = new ds.Tree();
        tree1.insert(0, compFunction);
        tree1.insert(1, compFunction);
        tree1.insert(2, compFunction);
        tree1.insert(3, compFunction);
        tree1.deleteElement(0, compFunction);

        expect(tree1.root.content).toBe(2);
        expect(tree1.root.leftChild.content).toBe(1);
        expect(tree1.root.rightChild.content).toBe(3);

        var tree2 = new ds.Tree();
        tree2.insert(objs[0]);
        tree2.insert(objs[1]);
        tree2.insert(objs[2]);
        tree2.insert(objs[3]);
        tree2.deleteElement(objs[0]);

        expect(tree2.root.content).toBe(objs[2]);
        expect(tree2.root.leftChild.content).toBe(objs[1]);
        expect(tree2.root.rightChild.content).toBe(objs[3]);
    });

    it('deletes root element and keeps itself balanced', function() {
        var compFunction = util.comparator.compare;

        var tree1 = new ds.Tree();
        tree1.insert(0, compFunction);
        tree1.insert(1, compFunction);
        tree1.insert(2, compFunction);
        tree1.insert(3, compFunction);
        expect(tree1.root.content).toBe(1);
        tree1.deleteElement(1, compFunction);

        expect(tree1.root.content).toBe(2);
        expect(tree1.root.leftChild.content).toBe(0);
        expect(tree1.root.leftChild.leftChild).toBe(null);
        expect(tree1.root.leftChild.rightChild).toBe(null);
        expect(tree1.root.rightChild.content).toBe(3);
        expect(tree1.root.rightChild.leftChild).toBe(null);
        expect(tree1.root.rightChild.rightChild).toBe(null);

        var tree2 = new ds.Tree();
        tree2.insert(3, compFunction);
        tree2.insert(2, compFunction);
        tree2.insert(1, compFunction);
        tree2.insert(0, compFunction);
        expect(tree2.root.content).toBe(2);
        tree2.deleteElement(2, compFunction);

        expect(tree2.root.content).toBe(1);
        expect(tree2.root.leftChild.content).toBe(0);
        expect(tree2.root.leftChild.leftChild).toBe(null);
        expect(tree2.root.leftChild.rightChild).toBe(null);
        expect(tree2.root.rightChild.content).toBe(3);
        expect(tree2.root.rightChild.leftChild).toBe(null);
        expect(tree2.root.rightChild.rightChild).toBe(null);
    });

    it('gets an exact element', function() {
        var compFunction = util.comparator.compare;
        var compMethod = function(el) {return compFunction(this.val, el.val);};
        var objs = [{val: 0}, {val: 1}, {val: 2}, {val: 3}];
        objs.forEach(function(el) {el.compareTo = compMethod});

        var tree1 = new ds.Tree();
        tree1.insert(0, compFunction);
        tree1.insert(1, compFunction);
        tree1.insert(2, compFunction);

        expect(tree1.get(0, compFunction)).toBe(0);
        expect(tree1.get(3, compFunction)).toBe(null);

        var tree2 = new ds.Tree();
        tree2.insert(objs[0]);
        tree2.insert(objs[1]);
        tree2.insert(objs[2]);

        expect(tree2.get(objs[0])).toBe(objs[0]);
        expect(tree2.get(objs[3])).toBe(null);
    });

    it('gets an closest element', function() {
        var compFunction = util.comparator.compare;
        var compMethod = function(el) {return compFunction(this.val, el.val);};
        var objs = [{val: 0}, {val: 1}, {val: 2}, {val: 3}];
        objs.forEach(function(el) {el.compareTo = compMethod});

        var tree1 = new ds.Tree();
        tree1.insert(0, compFunction);
        tree1.insert(1, compFunction);
        tree1.insert(2, compFunction);

        expect(tree1.getClosest(0, compFunction)).toBe(0);
        expect(tree1.getClosest(3, compFunction)).toBe(2);

        var tree2 = new ds.Tree();
        tree2.insert(objs[0]);
        tree2.insert(objs[1]);
        tree2.insert(objs[2]);

        expect(tree2.getClosest(objs[0])).toBe(objs[0]);
        expect(tree2.getClosest(objs[3])).toBe(objs[2]);
    });
});

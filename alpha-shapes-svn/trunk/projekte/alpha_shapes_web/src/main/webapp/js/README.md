#Alpha Shapes

This is the API documentation for the Alpha Shapes HTML5 project. The project
is organized in packages containing the classes listed.

##util
Various utility functions concerning arrays and comparsions, ... 

+ Misc

##geom
Geometric data types

+ Vector
+ Circle
+ Triangle
+ Line
+ LineSegment
+ Ray
+ Rectangle

##ds
Data structures

### Doubly Connected Edge List
+ EdgeList
+ Vertex
+ HalfEdge
+ Face

### AVL Tree
+ Tree
+ TreeNode

##algo

Algorithms

### Compute convex hull
+ ConvexHull

### Compute farthest point Voronoi diagram
+ Skyum

### Closest point Voronoi diagram
+ Fortune
+ FortuneArc
+ FortuneBreakpoint
+ FortuneTree
+ FortuneTeeNode

### Voronoi diagram evaluation and Delaunay graph
+ VoronoiDelaunay
+ VoronoiNeighbours
+ VoronoiCell

### Alpha Shape and Hull
+ AlphaShape

##ui
Everything concerning controlling the application

+ Application
+ Computations
+ UserData
+ ButtonController
+ SliderController
+ CanvasEventController
+ CanvasDrawingController
+ CanvasDrawer
+ SvgDrawer

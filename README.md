REST Api 

GET:
    <!-- Use Path Params to Parse Id To Get Product -->
    Get Single Product By Id : http://localhost:3000/products/1
    <!-- Specify The Query To Filter The Products -->
    Get Product By Query : http://localhost:3000/products/filter
    <!-- Get All Products -->
    Get All Products : http://localhost:3000/products

POST:
    Post New Product : http://localhost:3000/add/products
    <!-- Must Fill Data To All Field -->

PATCH: 
    Update Single Product : http://localhost:3000/products/update/1
    <!-- MayBe Fill Required Records -->

DELETE:
    <!-- Delete Single Products By Using Path Params Id And Splice -->
    Delete Single Product : http://localhost:3000/products/delete/51
    <!-- Delete All Records Completely -->
    Delete All Records : http://localhost:3000/products/remove/all
# SkyCheck Supply Chain - Entity Relationship Diagram (ERD)

[ CUSTOMER ]
+ CustomerID (PK)
+ Name
+ Email
+ Phone
+ Address
      | 1
      |
      | (places)
      |
      v N
[ ORDER ]
+ OrderID (PK)
+ CustomerID (FK)
+ OrderDate
+ TotalAmount
+ Status
      | 1
      |
      | (contains)
      |
      v N
[ ORDER DETAILS ] <------ N (includes) 1 ------ [ PRODUCT ]
+ OrderDetailID (PK)                            + ProductID (PK)
+ OrderID (FK)                                  + Name
+ ProductID (FK)                                + Description
+ Quantity                                      + Price
+ Subtotal
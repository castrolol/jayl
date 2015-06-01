# Jayl

Jayl is a simple and light library to work with collections in Javascript with a linq-like sintax 

## Getting Started

### Creating a query

``` js
  var query = [...].toQuery();
```

the query is a container of expressions that performs these expressions when its value is necessary ... invoking **toArray**, **fisrt**, **last** or  **elementAt**

# Methods

## Restriction

### where
filter a collection

``` js
  var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var query = numbers.toQuery();
  query.where("$x % 2 == true");
  var filtered = query.toArray(); // [0, 2, 4, 6, 8];
  ```
or
``` js
  var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  var query = numbers.toQuery().where(function(n){
    return n % 2 == true;
  });
  var filtered = query.toArray(); // [0, 2, 4, 6, 8];
  ```

## Projection

### select 
convert all itens in another format
``` js
  var persons = [{ name: 'Foo' }, { name: 'Baz' }, { name: 'Bar' }];
  var query = persons.toQuery();
  query.select("$x.name");
  var names = query.toArray(); // ['Foo', 'Baz', 'Bar'];
  ```
or
``` js
  var persons = [{ name: 'Foo' }, { name: 'Baz' }, { name: 'Bar' }];
  var query = persons.toQuery();
  query.select(function(person){
     return person.name;
  });
  var names = query.toArray(); // ['Foo', 'Baz', 'Bar'];
  ```
  
 
### selectMany

``` js
  var persons = [{ name: ['Foo', 'Foo2'] }, { name: ['Baz'] }, { name: ['Bar', 'Baree'] }];
  var query = persons.toQuery();
  query.selectMany("$x.name");
  var names = query.toArray(); 
  console.log(names); // ['Foo', 'Foo2', 'Baz', 'Bar', 'Baree'];
  ```
or
``` js
  var persons = [{ name: ['Foo', 'Foo2'] }, { name: ['Baz'] }, { name: ['Bar', 'Baree'] }];
  var query = persons.toQuery();
  query.selectMany(function(person){
     return person.name;
  });
  var names = query.toArray(); // ['Foo', 'Foo2', 'Baz', 'Bar', 'Baree'];
  ```
  
##Partitioning

###take
###skip
###takeWhile
###skipWhile

##Ordering

###orderBy
###orderByDescending
###reverse

##Grouping

###groupBy

##Set

###union
###distinct
###intersect
###except

##Element

###first
###last
###elementAy

##Quantifiers

###any
###all

##Aggregate

###count
###sum
###min
###max
###average
###concat
###equalAll
###combine

##Conversion

###toArray
###ofType



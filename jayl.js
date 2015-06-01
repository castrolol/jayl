/**
* 14-11-2012
*
* @author Luan Aleixo / luan.castro.aleixo@gmail.com
* @name Jayl - Jayl Ani't Yet Linq
* @description:
*
*	Jayl is a simple and light library to work with collections in Javascript with a linq-like sintax sugar
*
*/

(function (w) {

    w.Array.prototype && (w.Array.prototype.toQuery = function () { return new jayl(this); });
    w.Array.prototype && (w.Array.prototype.isArray = function () { return true; });
    function trim(str) { try { return str.toString().replace(/^\s+|\s+$/g, ""); } catch (e) { return str; } };

    var Expression = function (type, args) {
        this.method = type || "";
        this.parameters = args || [];

    }

    var KeyValuePair = function (key, value) {

        this.key = key;
        this.value = value;

    }

    var jayl = function (collection, jaylProvider) {

        var _array = [];
        var _provider = new jaylToObjects();
        var _expressionTree = [];
        var more = arguments[2];

        var JaylQuery = function (collection, jaylProvider) {

            _array = collection || [];
            _provider = jaylProvider || _provider;

            if (more) {
                more._expressionTree && (_expressionTree = more._expressionTree);
            }

        }

        var publico = JaylQuery.prototype;

        var addExpression = function (expression) {

            var newJayl = jayl(_array, _provider, { _expressionTree: _expressionTree.concat(expression) });
            return newJayl;
        }

        var resolveExpression = function (expression) {


            var dynamicArray = _array.slice(0);

            for (var i = 0; i < _expressionTree.length; i++) {

                var exp = _expressionTree[i];

                var method = createMethod(exp);

                dynamicArray = method(dynamicArray);

            }

            return createMethod(expression)(dynamicArray);
        }

        var createMethod = function (expression) {

            var returnMethod = function (x) { return x; };

            try {

                if (_provider[expression.method]) {

                    returnMethod = _provider[expression.method];

                } else if (defaultProvider[expression.method]) {

                    returnMethod = defaultProvider[expression.method];

                }


            } catch (e) { }

            return function (array) { return returnMethod.apply(array, expression.parameters); };
        }

        //Restriction Operators

        publico.where = function (predicate) {
            return addExpression(new Expression("where", arguments));
        }

        //Projection Operators

        publico.select = function (selector) {
            return addExpression(new Expression("select", arguments));
        }

        publico.selectMany = function (property, selector) {
            return addExpression(new Expression("selectMany", arguments));
        }

        //Partitioning Operators
        publico.take = function (count, predicate) {
            return addExpression(new Expression("take", arguments));
        }

        publico.skip = function (count, predicate) {
            return addExpression(new Expression("skip", arguments));
        }

        publico.takeWhile = function (predicate) {
            return addExpression(new Expression("takeWhile", arguments));
        }

        publico.skipWhile = function (predicate) {
            return addExpression(new Expression("skipWhile", arguments));
        }

        //Ordering Operators

        publico.orderBy = function (orderMethod) {
            return addExpression(new Expression("orderBy", arguments));
        }

        publico.orderByDescending = function (orderMethod) {
            return addExpression(new Expression("orderByDescending", arguments));
        }

        publico.reverse = function () {
            return addExpression(new Expression("reverse", arguments));
        }


        //Grouping Operators
        publico.groupBy = function (property, compareMethod) {
            return addExpression(new Expression("groupBy", arguments));
        }


        //Set Operators
        publico.union = function (collection, compareMethod) {
            return addExpression(new Expression("union", arguments));
        }

        publico.distinct = function (property, compareMethod) {
            return addExpression(new Expression("distinct", arguments));
        }

        publico.intersect = function (collection, compareMethod) {
            return addExpression(new Expression("intersect", arguments));
        }

        publico.except = function (collection, compareMethod) {
            return addExpression(new Expression("except", arguments));
        }

        //Element Operators 
        publico.first = function (predicate) {
            return resolveExpression(new Expression("first", arguments));
        }

        publico.last = function (predicate) {
            return resolveExpression(new Expression("last", arguments));
        }

        publico.elementAt = function (index) {

            return resolveExpression(new Expression("elementAt", arguments));

        }

        //Quantifiers Operators

        publico.any = function (predicate) {
            return resolveExpression(new Expression("any", arguments));
        }

        publico.all = function (predicate) {
            return resolveExpression(new Expression("all", arguments));
        }

        //Aggregate Operators


        publico.count = function (predicate) {
            return resolveExpression(new Expression("count", arguments));
        }

        publico.sum = function (selector) {
            return resolveExpression(new Expression("sum", arguments));
        }

        publico.min = function (selector) {
            return resolveExpression(new Expression("min", arguments));
        }

        publico.max = function (selector) {
            return resolveExpression(new Expression("max", arguments));
        }

        publico.average = function (selector) {
            return resolveExpression(new Expression("average", arguments));
        }

        publico.concat = function (collection) {
            return resolveExpression(new Expression("concat", arguments));
        }

        publico.equalAll = function (collection, compareMethod) {
            return resolveExpression(new Expression("equalAll", arguments));
        }

        publico.combine = function (collection, combineMethod) {
            return addExpression(new Expression("concat", arguments));
        }

        //Conversion Operators
        publico.toArray = function () {
            return resolveExpression(new Expression("toArray", arguments));
        }

        publico.ofType = function (type) {
            return resolveExpression(new Expression("ofType", arguments));
        }


        return new JaylQuery(collection, jaylProvider);
    }



    var jaylToObjects = function () {

        function quickSort(vet, sortF, esq, dir) {

            var ce = esq, cd = dir, meio = parseInt((ce + cd) / 2);

            while (ce < cd) {
                while (sortF(vet[ce], vet[meio]) === -1) {
                    ce++;
                }
                while (sortF(vet[cd] > vet[meio]) === 1) {
                    cd--;
                }
                if (ce <= cd) {
                    var temp = vet[ce];
                    vet[ce] = vet[cd];
                    vet[cd] = temp;
                    ce++;
                    cd--;
                }
            }
            if (cd > esq) quickSort(vet, sortF, esq, cd);

            if (ce < dir) quickSort(vet, sortF, ce, dir);
        }

        var publico = this;

        var compileMethod = function (method, def) {

            if (typeof method == "undefined" || method == null) return def || function (x) { return x; }

            if (typeof method == "function") return method;

            if (typeof method != "string") {

                return function () { return method; };

            }

            if (! ~method.indexOf("return")) {

                var itens = trim(method).split(";");

                if (itens.length) {

                    itens[itens.length - 1] = "return (" + itens[itens.length - 1] + " )";
                    method = itens.join(";");

                } else {

                    method += "return " + method;

                }

            }


            method = "try{ \n\tvar $x = arguments[0] ;\n\tvar $y = arguments[1];\n\tvar $z = arguments[2];\n }catch(e){ }\n" + method;
            return new Function(method);
        }


        //Restriction Operators

        publico.where = function (predicate) {

            predicate = compileMethod(predicate);
            var vetor = this;
            var retorno = [];

            for (var i = 0; i < vetor.length; i++) {

                predicate(vetor[i]) && retorno.push(vetor[i]);

            }

            return retorno;
        }

        //Projection Operators

        publico.select = function (selector) {

            selector = compileMethod(selector);
            var vetor = this;
            var retorno = [];

            for (var i = 0; i < vetor.length; i++) {

                retorno.push(selector(vetor[i]));

            }

            return retorno;
        }

        publico.selectMany = function (property, selector) {

            selector = compileMethod(selector);

            property = compileMethod(property);

            var vetor = this;
            var retorno = [];

            for (var i = 0; i < vetor.length; i++) {

                var prop = property(vetor[i]);

                if (typeof prop == "undefined" || prop == null || !prop.push || !prop.pop) {
                    prop = [];
                }
                for (var j = 0; j < prop.length; j++) {
                    retorno.push(selector(prop[j]));
                }
            }

            return retorno;

        }

        //Partitioning Operators
        publico.take = function (count, predicate) {

            count = +count;
            predicate = compileMethod(predicate);
            var vetor = this;
            var retorno = [];

            for (var i = 0; i < vetor.length; i++) {

                predicate(vetor[i]) && retorno.push(vetor[i]);

                if (retorno.length >= count) {
                    break;
                }

            }

            return retorno;
        }


        publico.skip = function (count, predicate) {

            count = +count;
            predicate = compileMethod(predicate);
            var vetor = this;
            var retorno = [];

            for (var i = 0; i < vetor.length; i++) {

                if (count > 0 && predicate(vetor[i])) {
                    count--;
                    continue;
                }

                retorno.push(vetor[i]);
            }

            return retorno;

        }

        publico.takeWhile = function (predicate) {

            predicate = compileMethod(predicate);
            var vetor = this;
            var retorno = [];

            for (var i = 0; i < vetor.length; i++) {

                if (!predicate(vetor[i])) {
                    break;
                }

                retorno.push(vetor[i]);
            }

            return retorno;
        }

        publico.skipWhile = function (predicate) {

            predicate = compileMethod(predicate);
            var vetor = this;
            var retorno = [];

            for (var i = 0; i < vetor.length; i++) {

                if (predicate(vetor[i])) {
                    continue;
                }

                retorno.push(vetor[i]);
            }

            return retorno;
        }

        //Ordering Operators
        /*
		publico.orderBy = function (orderMethod) {

			orderMethod = compileMethod(orderMethod, function (x, y) { return x - y; });
			return this.sort(orderMethod);

		}

		publico.orderByDescending = function (orderMethod) {

			orderMethod = compileMethod(orderMethod, function (x, y) { return x - y; });



			return this.sort(function (x, y) { return orderMethod(y, x); });

		}*/

        publico.orderBy = function (orderMethod) {

            if (typeof orderMethod == "string") {
                if (!~orderMethod.indexOf("$x") && !~orderMethod.indexOf("$y") && !/[<>+&|^*/!-]/.test(orderMethod)) {
                    orderMethod = "$x." + orderMethod + " > $y." + orderMethod + " ? 1 : -1";
                }
            }

            orderMethod = compileMethod(orderMethod, function (x, y) { return x - y; });
            return this.sort(orderMethod);

        }

        publico.orderByDescending = function (orderMethod) {

            if (typeof orderMethod == "string") {
                if (!~orderMethod.indexOf("$x") && !~orderMethod.indexOf("$y") && !/[<>+&|^*/!-]/.test(orderMethod)) {
                    orderMethod = "$x." + orderMethod + " > $y." + orderMethod + " ? 1 : -1";
                }
            }

            orderMethod = compileMethod(orderMethod, function (x, y) { return x - y; });

            return this.sort(function (x, y) { return orderMethod(y, x); });

        }

        publico.reverse = function () {
            return this.reverse();
        }


        //Grouping Operators
        publico.groupBy = function (property, compareMethod) {


            property = compileMethod(property, function (x) { return x; });
            compareMethod = compileMethod(compareMethod, function (x, y) { return x == y });


            var groups = [];
            var vetor = this;
            var found = false;
            var prop;

            for (var i = 0; i < vetor.length; i++) {

                found = false;
                prop = property(vetor[i]);

                for (var j = 0; j < groups.length; j++) {

                    if (compareMethod(groups[j].key, prop)) {

                        groups[j].value.push(vetor[i]);
                        found = true;
                        break;
                    }

                }

                if (!found) {

                    groups.push(new KeyValuePair(prop, [vetor[i]]));

                }

            }


            return groups;
        }


        //Set Operators
        publico.union = function (collection, compareMethod) {

            var vetor = this.slice(0);
            collection = collection || [];
            compareMethod = compileMethod(compareMethod, function (x, y) { return x == y; });
            var contains = false;
            for (var i = 0; i < collection.length; i++) {

                contains = false;

                for (var j = 0; j < vetor.length; j++) {
                    if (compareMethod(vetor[j], collection[i])) {
                        contains = true;
                        break;
                    }
                }

                if (!contains) {
                    vetor.push(collection[i]);
                }
            }

            return vetor;
        }

        publico.distinct = function (property, compareMethod) {

            property = compileMethod(property, function (x) { return x; });
            compareMethod = compileMethod(compareMethod, function (x, y) { return x == y });

            var retorno = [];
            var properties = [];
            var vetor = this;
            var prop;
            var found = false;

            for (var i = 0; i < vetor.length; i++) {

                found = false;
                prop = property(vetor[i]);

                for (var j = 0; j < properties.length; j++) {

                    if (compareMethod(prop, properties[j])) {
                        found = true;
                        break;
                    }

                }

                if (!found) {

                    retorno.push(vetor[i]);
                    properties.push(prop);

                }
            }

            return retorno;

        }

        publico.intersect = function (collection, compareMethod) {

            var retorno = [];
            collection = collection || [];
            compareMethod = compileMethod(compareMethod, function (x, y) { return x == y; });

            var contains = false;

            for (var i = 0; i < collection.length; i++) {

                contains = false;

                for (var j = 0; j < vetor.length; j++) {
                    if (compareMethod(vetor[j], collection[i])) {
                        contains = true;
                        break;
                    }
                }

                if (contains) {
                    retorno.push(collection[i]);
                }
            }

            return retorno;
        }

        publico.except = function (collection, compareMethod) {

            var retorno = [];
            collection = collection || [];

            compareMethod = compileMethod(compareMethod, function (x, y) { return x == y; });

            var vetor = this;
            var contains = false;

            for (var i = 0; i < vetor.length; i++) {

                contains = false;

                for (var j = 0; j < collection.length; j++) {

                    if (compareMethod(collection[j], vetor[i])) {
                        contains = true;
                        break;
                    }

                }

                if (!contains) {
                    retorno.push(vetor[i]);
                }
            }

            return retorno;

        }

        //Element Operators 
        publico.first = function (predicate) {

            predicate = compileMethod(predicate);
            var vetor = this;

            for (var i = 0; i < vetor.length; i++) {

                if (predicate(vetor[i])) {
                    return vetor[i];
                }

            }

            return null;
        }

        publico.last = function (predicate) {

            predicate = compileMethod(predicate);
            var vetor = this;
            var last = null;

            for (var i = 0; i < vetor.length; i++) {

                if (predicate(vetor[i])) {
                    last = vetor[i];
                }

            }

            return last;
        }

        publico.elementAt = function (index) {

            var index = +index;
            return this[index];

        }

        //Quantifiers Operators

        publico.any = function (predicate) {
            predicate = compileMethod(predicate);
            var vetor = this;

            for (var i = 0; i < vetor.length; i++) {

                if (predicate(vetor[i])) {
                    return true;
                }

            }

            return false;
        }

        publico.all = function (predicate) {

            predicate = compileMethod(predicate);
            var vetor = this;

            if (this.length) return false;

            for (var i = 0; i < vetor.length; i++) {

                if (!predicate(vetor[i])) {
                    return false;
                }

            }

            return true;
        }

        //Aggregate Operators


        publico.count = function (predicate) {

            predicate = compileMethod(predicate);
            var vetor = this;
            var count = 0;

            for (var i = 0; i < vetor.length; i++) {

                predicate(vetor[i]) && count++;

            }

            return count;
        }

        publico.sum = function (selector) {

            selector = compileMethod(selector);
            var vetor = this;
            var soma = 0;

            for (var i = 0; i < vetor.length; i++) {

                soma += selector(vetor[i])

            }

            return soma;
        }

        publico.min = function (selector) {

            selector = compileMethod(selector);
            var vetor = this;
            var vMin = Number.POSITIVE_INFINITY;
            var min = null;

            for (var i = 0; i < vetor.length; i++) {

                var prop = selector(vetor[i]);

                if (vMin > prop) {

                    vMin = prop;
                    min = vetor[i];

                }

            }

            return min;
        }

        publico.max = function (selector) {

            selector = compileMethod(selector);
            var vetor = this;
            var vMax = Number.NEGATIVE_INFINITY;
            var max = null;

            for (var i = 0; i < vetor.length; i++) {

                var prop = selector(vetor[i]);

                if (vMax < prop) {

                    vMax = prop;
                    max = vetor[i];

                }

            }

            return max;
        }


        publico.average = function (selector) {

            selector = compileMethod(selector);
            var vetor = this;
            var soma = 0;

            for (var i = 0; i < vetor.length; i++) {

                soma += selector(vetor[i])

            }

            return soma / vetor.length;
        }

        publico.concat = function (collection) {
            return this.concat(collection);
        }

        publico.equalAll = function (collection, compareMethod) {

            compareMethod = compileMethod(compareMethod, function (x, y) { return x == y; });
            var vetor = this;
            if (vetor.length !== collection.length) return false;

            for (var i = 0; i < vetor.length; i++) {

                if (!compareMethod(vetor[i], collection[i])) return false;

            }
            return true;
        }

        publico.combine = function (collection, combineMethod) {

            combineMethod = compileMethod(combineMethod, function (x, y) { return x + y; });

            var vetor = this;
            var resultado = [];
            var min = Math.min(vetor.length, collection.length);

            for (var i = 0; i < min; i++) {

                resultado.push(combineMethod(vetor[i], collection[i]));

            }

            return resultado;
        }

        //Conversion Operators
        publico.toArray = function () {

            return this;

        }

        publico.ofType = function (type) {

            type = type.toString();
            var vetor = this;
            var retorno = [];

            for (var i = 0; i < vetor.length; i++) {

                if (typeof vetor[i] == type) {

                    retorno.push(vetor[i]);

                }

            }

            return retorno;

        }




    }

    var defaultProvider = new jaylToObjects();

    //Generation Operators

    jayl.range = function (start, size) {
        var retorno = [];
        for (var i = 0; i < size; i++) {
            retorno.push(start++);
        }
        return retorno.toQuery();
    }

    jayl.repeat = function (value, times) {
        var retorno = [];
        for (var i = 0; i < times; i++) {
            retorno.push(value);
        }
        return retorno.toQuery();
    }


    w.JaylQuery = jayl;

})(window);
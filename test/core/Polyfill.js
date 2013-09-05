var assert = chai.assert,
    equal = assert.equal,
    deepEqual = assert.deepEqual;

suite('Polyfill', function() {
    setup(function() {

    });

    suite('Function', function() {
        suite('pass', function() {
            var foo = function() {
                var result = '';

                for (var i = 0, l = arguments.length; i < l; i++) {
                    if (typeOf(arguments[i]) === 'array') {
                        result += arguments[i].join('-');
                    } else {
                        result += arguments[i];
                    }
                }

                return result;
            };

            var bar = foo.pass('hello');
            var baz = foo.pass([['peach', 'apply', 'orange']]);

            test('should pass arguments to pseudo-function', function() {
                equal(bar(), 'hello');
                equal(baz(), 'peach-apply-orange');
            });
        });

        suite('delay', function() {

        });

        suite('periodical', function() {

        });
    });

    suite('Array', function() {
        suite('append', function() {
            test('should add to the end', function() {
                deepEqual(['red', 'blue'].append(['green', 'yellow']), ['red', 'blue', 'green', 'yellow']);
            });
            test('should not collapse nested arrays', function() {
                deepEqual([0, 1, 2].append([3, [4]]), [0, 1, 2, 3, [4]]);
            });
        });

        suite('associate', function() {
            test('should map values to keys', function() {
                deepEqual(['Moo', 'Oink', 'Woof', 'Miao'].associate(['Cow', 'Pig', 'Dog', 'Cat']), {
                    Cow: 'Moo',
                    Pig: 'Oink',
                    Dog: 'Woof',
                    Cat: 'Miao'
                });
            });
        });

        suite('average', function() {
            test('should return the average sum', function() {
                equal([1, 2, 3].average(), 2);
            });
        });

        suite('clean', function() {
            test('should remove null and undefined', function() {
                deepEqual([1, 0, null, '', 2, false, 3, undefined].clean(), [1, 0, '', 2, false, 3]);
            });
        });

        suite('clone', function() {
            test('should not share references', function() {
                var base = ['red', 'green', 'blue'],
                    clone = base.clone();

                base[0] = 'yellow';

                equal(base[0], 'yellow');
                equal(clone[0], 'red');
            });
        });

        suite('combine', function() {
            test('should combine and unique values', function() {
                deepEqual(['Cow', 'Pig', 'Dog'].combine(['Cat', 'Dog']), ['Cow', 'Pig', 'Dog', 'Cat']);
            });
        });

        suite('contains', function() {
            test('should return boolean if contains values', function() {
                assert.isTrue(['a', 'b', 'c'].contains('a'));
                assert.isFalse(['a', 'b', 'c'].contains('d'));
            });
        });

        suite('each', function() {
            test('should iterate like forEach', function() {
                var match = '';

                ['apple', 'banana', 'lemon'].each(function(item, index) {
                    match += index + ' = ' + item + '; ';
                });

                equal(match, '0 = apple; 1 = banana; 2 = lemon; ');
            });
        });

        suite('empty', function() {
            test('should empty all items', function() {
                equal(['old', 'data'].empty().length, [].length);
            });
        });

        suite('erase', function() {
            test('should erase all items that match the value', function() {
                deepEqual(['Cow', 'Pig', 'Dog', 'Cat', 'Dog'].erase('Dog'), ['Cow', 'Pig', 'Cat']);
                deepEqual(['Cow', 'Pig', 'Dog'].erase('Cat'), ['Cow', 'Pig', 'Dog']);
            });
        });

        suite('every', function() {
            test('should return false since they arent larger than 20', function() {
                assert.isFalse([10, 4, 25, 100].every(function(item, index) {
                    return (item > 20);
                }));
            });
        });

        suite('flatten', function() {
            test('should flatten a multi-dimensional array', function() {
                deepEqual([1, 2, 3, [4, 5, [6, 7]], [[[8]]]].flatten(), [1, 2, 3, 4, 5, 6, 7, 8]);
            });
        });

        suite('filter', function() {
            test('should return items that pass the callback', function() {
                deepEqual([10, 3, 25, 100].filter(function(item, index) {
                    return (item > 20);
                }), [25, 100]);
            });
        });

        suite('getLast', function() {
            test('should return the last item', function() {
                equal(['Cow', 'Pig', 'Dog', 'Cat'].getLast(), 'Cat');
            });
        });

        suite('getRandom', function() {
            test('should return a random item', function() {
                assert.isDefined(['Cow', 'Pig', 'Dog', 'Cat'].getRandom());
            });
        });

        suite('include', function() {
            test('should include value if it doesnt exist', function() {
                deepEqual(['Cow', 'Pig', 'Dog'].include('Cat'), ['Cow', 'Pig', 'Dog', 'Cat']);
                deepEqual(['Cow', 'Pig', 'Dog'].include('Dog'), ['Cow', 'Pig', 'Dog']);
            });
        });

        suite('indexOf', function() {
            test('should return index number', function() {
                equal(['apple', 'lemon', 'banana'].indexOf('lemon'), 1);
                equal(['apple', 'lemon'].indexOf('banana'), -1);
            });
        });

        suite('invoke', function() {
            test('should invoke the method on each value', function() {
                deepEqual([4, 8, 15, 16, 23, 42].invoke('limit', 10, 30), [10, 10, 15, 16, 23, 30]);
            });
        });

        suite('map', function() {
            test('should double each value by 2', function() {
                deepEqual([1, 2, 3].map(function(item, index) {
                    return (item * 2);
                }), [2, 4, 6]);
            });
        });

        suite('max', function() {
            test('should return the highest number', function() {
                equal([1, 2, 3].max(), 3);
            });
        });

        suite('min', function() {
            test('should return the lowest number', function() {
                equal([1, 2, 3].min(), 1);
            });
        });

        suite('pick', function() {
            test('should return first non-null', function() {
                equal([null, 0, 1].pick(), 0);
            });
        });

        suite('reduce', function() {
            test('should accumulate from the left', function() {
                equal([0, 1, 2, 3, 4].reduce(function(a, b) {
                    return (a + b);
                }), 10);
            });
            test('should accumulate from the left with starting accumulator', function() {
                equal([0, 1, 2, 3, 4].reduce(function(a, b) {
                    return (a + b);
                }, 20), 30);
            });
        });

        suite('reduceRight', function() {
            test('should accumulate from the right', function() {
                deepEqual([[0, 1], [2, 3], [4, 5]].reduceRight(function(a, b) {
                    return a.concat(b);
                }, []), [4, 5, 2, 3, 0, 1]);
            });
        });

        suite('shuffle', function() {
            test('should randomize the items', function() {
                assert.notEqual([1, 2, 3, 4, 5].shuffle(), [1, 2, 3, 4, 5]);
            });
        });

        suite('some', function() {
            test('should return true since some are larger than 20', function() {
                assert.isTrue([10, 4, 25, 100].some(function(item, index) {
                    return (item > 20);
                }));
            });
        });

        suite('sum', function() {
            test('should return all values as a sum', function() {
                equal([1, 2, 3, 4, 5].sum(), 15);
            });
        });

        suite('unique', function() {
            test('should remove duplicate values', function() {
                deepEqual(['apple', 'lemon', 'pear', 'lemon', 'apple'].unique(), ['apple', 'lemon', 'pear']);
            });
        });
    });

    suite('Number', function() {
        suite('limit', function() {
            test('should limit between min and max', function() {
                equal((12).limit(2, 6.5), 6.5);
                equal((-4).limit(2, 6.5), 2);
                equal((4.3).limit(2, 6.5), 4.3);
            });
        });

        suite('round', function() {
            test('should round the number with optional precision', function() {
                equal((12.45).round(), 12);
                equal((12.45).round(1), 12.5);
                equal((12.45).round(-1), 10);
            });
        });

        suite('times', function() {
            test('should execute the function x times', function() {
                var count = 0;

                (4).times(function() {
                    count += 2;
                });

                equal(count, 8);
            });
        });

        suite('toFloat', function() {
            test('should convert int to float', function() {
                equal((111).toFloat(), 111);
                equal((111.1).toFloat(), 111.1);
            });
        });

        suite('toInt', function() {
            test('should convert float to int', function() {
                equal((111).toInt(), 111);
                equal((111.1).toInt(), 111);
                equal((111).toInt(2), 7);
            });
        });

        suite('Math', function() {
            test('should inherit Math methods', function() {
                equal((-1).abs(), 1);
                equal((3).pow(4), 81);
            });
        });
    });

    suite('String', function() {
        suite('camelCase', function() {
            test('should convert dashes to camel case', function() {
                equal('I-like-cookies'.camelCase(), 'ILikeCookies');
            });
        });

        suite('capitalize', function() {
            test('should capitalize all words', function() {
                equal('i like cookies'.capitalize(), 'I Like Cookies');
            });
        });

        suite('clean', function() {
            test('should remove extra whitespace', function() {
                equal(' i      like     cookies      \n\n'.clean(), 'i like cookies');
            });
        });

        suite('contains', function() {
            test('should return true', function() {
                assert.isTrue('abc'.contains('b'));
            });
        });

        suite('escapeRegExp', function() {
            test('should escape special chars', function() {
                equal('animals.sheep[1]'.escapeRegExp(), "animals\\.sheep\\[1\\]");
            });
        });

        suite('hyphenate', function() {
            test('should convert camel case to dashes', function() {
                equal('ILikeCookies'.hyphenate(), '-i-like-cookies');
            });
        });

        suite('hexToRgb', function() {
            test('should turn hex codes into rgb codes', function() {
                equal('#123'.hexToRgb(), 'rgb(17, 34, 51)');
                equal('112233'.hexToRgb(), 'rgb(17, 34, 51)');
                deepEqual('#112233'.hexToRgb(true), [17, 34, 51]);
            });
        });

        suite('rgbToHex', function() {
            test('should turn rgb codes into hex codes', function() {
                equal('rgb(17, 34, 51)'.rgbToHex(), '#112233');
                deepEqual('rgb(17, 34, 51)'.rgbToHex(true), ['11', '22', '33']);
                equal('rgba(17, 34, 51, 0)'.rgbToHex(), 'transparent');
            });
        });

        suite('substitute', function() {
            test('should replace values in the string', function() {
                var myString = '{subject} is {property_1} and {property_2}.';
                var myObject = { subject: 'Jack Bauer', property_1: 'our lord', property_2: 'saviour' };

                equal(myString.substitute(myObject), 'Jack Bauer is our lord and saviour.');
            });
        });

        suite('stripScripts', function() {
            test('should remove script tags', function() {
                equal("<script>alert('Hello')</script>Hello, World.".stripScripts(), 'Hello, World.');
            });
        });

        suite('toInt', function() {
            test('should convert to numbers', function() {
                equal('4em'.toInt(), 4);
                equal('10px'.toInt(), 10);
            });
        });

        suite('toFloat', function() {
            test('should convert to floats', function() {
                equal('95.25%'.toFloat(), 95.25);
                equal('10.848'.toFloat(), 10.848);
            });
        });
    });

    suite('Object', function() {
        suite('alias', function() {
            test('should alias existing methods to a new key', function() {
                Object.foo = function() {
                    return 'bar';
                };

                assert.isUndefined(Object.oof);

                Object.alias('oof', 'foo');

                assert.isDefined(Object.oof);
                equal(Object.oof(), 'bar');

                delete Object.foo;
                delete Object.oof;
            });
        });

        suite('append', function() {
            test('should copy props to each object', function() {
                var firstObj = {
                    name: 'John',
                    lastName: 'Doe'
                };
                var secondObj = {
                    age: '20',
                    sex: 'male',
                    lastName: 'Dorian'
                };

                deepEqual(Object.append(firstObj, secondObj), {
                    name: 'John',
                    lastName: 'Dorian',
                    age: '20',
                    sex: 'male'
                });
            });
        });

        suite('cleanValues', function() {
            test('should remove empty values', function() {
                var obj1 = {
                    foo: 'bar',
                    something: 'else',
                    missing: null
                };
                var obj2 = {
                    a: -1,
                    b: 2,
                    c: 0,
                    d: -5,
                    e: 'foo'
                };

                deepEqual(Object.cleanValues(obj1), {
                    foo: 'bar',
                    something: 'else'
                });

                deepEqual(Object.cleanValues(obj2, function(value) {
                    if (typeOf(value) !== "number") {
                        return true;
                    }
                    return value > 0;
                }), {
                    b: 2,
                    e: 'foo'
                });
            });
        });

        suite('clone', function() {
            test('should clone without references', function() {
                var obj1 = { a: 0, b: 1 };
                var obj2 = Object.clone(obj1);

                obj1.a = 42;

                equal(obj1.a, 42);
                equal(obj2.a, 0);
            });
        });

        suite('contains', function() {
            test('should return true if value exists', function() {
                var object = { a: 'one', b: 'two', c: 'three' };

                assert.isTrue(Object.contains(object, 'one'));
                assert.isFalse(Object.contains(object, 'four'));
            });
        });

        suite('each', function() {
            test('should loop over objects', function() {
                var result = '';

                Object.each({first: 'Sunday', second: 'Monday', third: 'Tuesday'}, function(value, key) {
                    result += key + '=' + value + '; ';
                });

                equal(result, 'first=Sunday; second=Monday; third=Tuesday; ');
            });
        });

        suite('erase', function() {
            test('should remove keys and values from the object', function() {
                var alphabet = { a: 'a', b: 'b', c: 'c' };

                deepEqual(Object.erase(alphabet, 'b'), {
                    a: 'a',
                    c: 'c'
                });
            });
        });

        suite('every', function() {
            test('should return false since not all pass', function() {
                var object = {a: 10, b: 4, c: 25, d: 100};

                assert.isFalse(Object.every(object, function(value, key) {
                    return value > 20;
                }));
            });
        });

        suite('extend', function() {
            test('should add new static members', function() {
                assert.isUndefined(Object.foo);

                Object.extend('foo', function() {
                    return 'bar';
                });

                assert.isDefined(Object.foo);
                equal(Object.foo(), 'bar');

                delete Object.foo;
            });
        });

        suite('filter', function() {
            test('should return a new object with filtered values', function() {
                var object = { a: 10, b: 20, c: 30 };

                deepEqual(Object.filter(object, function(value, key) {
                    return value > 20;
                }), { c: 30 });
            });
        });

        suite('getFromPath', function() {
            test('should return values from the object tree', function() {
                var object = {
                    food: {
                        fruits: {
                            apples: "red",
                            lemon: "yellow"
                        }
                    }
                };

                equal(Object.getFromPath(object, 'food.fruits.apples'), 'red');
                equal(Object.getFromPath(object, ['food', 'fruits', 'lemon']), 'yellow');
            });
        });

        suite('getLength', function() {
            test('should return size', function() {
                equal(Object.getLength({
                    name: 'John',
                    lastName: 'Doe'
                }), 2);
            });
        });

        suite('keys', function() {
            test('should return properties', function() {
                deepEqual(Object.keys({
                    foo: 'bar',
                    key: 123456
                }), ['foo', 'key']);
            });
        });

        suite('keyOf', function() {
            test('should return key name based on value', function() {
                var object = { a: 'one', b: 'two', c: 3 };

                equal(Object.keyOf(object, 'two'), 'b');
                equal(Object.keyOf(object, 3), 'c');
                equal(Object.keyOf(object, 'four'), null);
            });
        });

        suite('map', function() {
            test('should apply callback to each value', function() {
                var object = { a: 1, b: 2, c: 3 };

                deepEqual(Object.map(object, function(value, key) {
                    return value * 2;
                }), {
                    a: 2,
                    b: 4,
                    c: 6
                });
            });
        });

        suite('merge', function() {
            test('should combine multiple objects', function() {
                var obj1 = { a: 0, b: 1 };
                var obj2 = { c: 2, d: 3 };
                var obj3 = { a: 4, d: 5 };

                deepEqual(Object.merge(obj1, obj2, obj3), {
                    a: 4,
                    b: 1,
                    c: 2,
                    d: 5
                });
            });
            test('should combine nested objects', function() {
                var obj1 = { a: { b: 1, c: 1 }};
                var obj2 = { a: { b: 2 }};

                deepEqual(Object.merge(obj1, obj2), { a: { b: 2, c: 1 }});
            });
        });

        suite('polyfill', function() {
            test('should add members if they dont exist', function() {
                Object.extend('foo', function() {
                    return 123;
                });

                assert.isUndefined(Object.bar);

                Object.polyfill({
                    foo: function() {
                        return 456;
                    },
                    bar: function() {
                        return 'abc';
                    }
                });

                assert.isDefined(Object.bar);
                equal(Object.foo(), 123);
                equal(Object.bar(), 'abc');

                delete Object.foo;
                delete Object.bar;
            });
        });

        suite('run', function() {
            test('should execute all methods in the object', function() {
                var count = 0,
                    object = {
                        one: function() { count += 1; },
                        two: function() { count += 2; }
                    };

                Object.run(object);
                equal(count, 3);
            });
        });

        suite('some', function() {
            test('should return true since some pass', function() {
                var object = { a: 10, b: 4, c: 25, d: 100 };

                assert.isTrue(Object.some(object, function(value, key) {
                    return value > 20;
                }));
            });
        });

        suite('subset', function() {
            test('should return values from key list', function() {
                var object = {
                    a: 'one',
                    b: 'two',
                    c: 'three'
                };

                deepEqual(Object.subset(object, ['a', 'c']), {
                    a: 'one',
                    c: 'three'
                });
            });
        });

        suite('toQueryString', function() {
            test('should convert an object to an HTTP query string', function() {
                equal(Object.toQueryString({ apple: 'red', lemon: 'yellow' }), 'apple=red&lemon=yellow');
                equal(Object.toQueryString({ apple: 'red', lemon: 'yellow' }, 'fruits'), 'fruits[apple]=red&fruits[lemon]=yellow');
            });
        });

        suite('values', function() {
            test('should return values', function() {
                deepEqual(Object.values({
                    foo: 'bar',
                    key: 123456
                }), ['bar', 123456]);
            });
        });
    });
});
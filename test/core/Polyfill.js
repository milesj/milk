var assert = chai.assert;

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
                assert.equal(bar(), 'hello');
                assert.equal(baz(), 'peach-apply-orange');
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
                assert.deepEqual(['red', 'blue'].append(['green', 'yellow']), ['red', 'blue', 'green', 'yellow']);
            });
            test('should not collapse nested arrays', function() {
                assert.deepEqual([0, 1, 2].append([3, [4]]), [0, 1, 2, 3, [4]]);
            });
        });

        suite('associate', function() {
            test('should map values to keys', function() {
                assert.deepEqual(['Moo', 'Oink', 'Woof', 'Miao'].associate(['Cow', 'Pig', 'Dog', 'Cat']), {
                    Cow: 'Moo',
                    Pig: 'Oink',
                    Dog: 'Woof',
                    Cat: 'Miao'
                });
            });
        });

        suite('average', function() {
            test('should return the average sum', function() {
                assert.equal([1, 2, 3].average(), 2);
            });
        });

        suite('clean', function() {
            test('should remove null and undefined', function() {
                assert.deepEqual([1, 0, null, '', 2, false, 3, undefined].clean(), [1, 0, '', 2, false, 3]);
            });
        });

        suite('clone', function() {
            test('should not share references', function() {
                var base = ['red', 'green', 'blue'],
                    clone = base.clone();

                base[0] = 'yellow';

                assert.equal(base[0], 'yellow');
                assert.equal(clone[0], 'red');
            });
        });

        suite('combine', function() {
            test('should combine and unique values', function() {
                assert.deepEqual(['Cow', 'Pig', 'Dog'].combine(['Cat', 'Dog']), ['Cow', 'Pig', 'Dog', 'Cat']);
            })
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

                assert.equal(match, '0 = apple; 1 = banana; 2 = lemon; ');
            });
        });

        suite('empty', function() {
            test('should empty all items', function() {
                assert.equal(['old', 'data'].empty().length, [].length);
            })
        });

        suite('erase', function() {
            test('should erase all items that match the value', function() {
                assert.deepEqual(['Cow', 'Pig', 'Dog', 'Cat', 'Dog'].erase('Dog'), ['Cow', 'Pig', 'Cat']);
                assert.deepEqual(['Cow', 'Pig', 'Dog'].erase('Cat'), ['Cow', 'Pig', 'Dog']);
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
                assert.deepEqual([1, 2, 3, [4, 5, [6, 7]], [[[8]]]].flatten(), [1, 2, 3, 4, 5, 6, 7, 8]);
            });
        });

        suite('filter', function() {
            test('should return items that pass the callback', function() {
                assert.deepEqual([10, 3, 25, 100].filter(function(item, index) {
                    return (item > 20);
                }), [25, 100]);
            });
        });

        suite('getLast', function() {
            test('should return the last item', function() {
                assert.equal(['Cow', 'Pig', 'Dog', 'Cat'].getLast(), 'Cat');
            });
        });

        suite('getRandom', function() {
            test('should return a random item', function() {
                assert.isDefined(['Cow', 'Pig', 'Dog', 'Cat'].getRandom());
            });
        });

        suite('include', function() {
            test('should include value if it doesnt exist', function() {
                assert.deepEqual(['Cow', 'Pig', 'Dog'].include('Cat'), ['Cow', 'Pig', 'Dog', 'Cat']);
                assert.deepEqual(['Cow', 'Pig', 'Dog'].include('Dog'), ['Cow', 'Pig', 'Dog']);
            });
        });

        suite('indexOf', function() {
            test('should return index number', function() {
                assert.equal(['apple', 'lemon', 'banana'].indexOf('lemon'), 1);
                assert.equal(['apple', 'lemon'].indexOf('banana'), -1);
            })
        });

        suite('invoke', function() {
            test('should invoke the method on each value', function() {
                assert.deepEqual([4, 8, 15, 16, 23, 42].invoke('limit', 10, 30), [10, 10, 15, 16, 23, 30]);
            });
        });

        suite('map', function() {
            test('should double each value by 2', function() {
                assert.deepEqual([1, 2, 3].map(function(item, index) {
                    return (item * 2);
                }), [2, 4, 6]);
            });
        });

        suite('max', function() {
            test('should return the highest number', function() {
                assert.equal([1, 2, 3].max(), 3);
            });
        });

        suite('min', function() {
            test('should return the lowest number', function() {
                assert.equal([1, 2, 3].min(), 1);
            });
        });

        suite('pick', function() {
            test('should return first non-null', function() {
                assert.equal([null, 0, 1].pick(), 0);
            });
        });

        suite('reduce', function() {
            test('should accumulate from the left', function() {
                assert.equal([0, 1, 2, 3, 4].reduce(function(a, b) {
                    return (a + b);
                }), 10);
            });
            test('should accumulate from the left with starting accumulator', function() {
                assert.equal([0, 1, 2, 3, 4].reduce(function(a, b) {
                    return (a + b);
                }, 20), 30);
            });
        });

        suite('reduceRight', function() {
            test('should accumulate from the right', function() {
                assert.deepEqual([[0, 1], [2, 3], [4, 5]].reduceRight(function(a, b) {
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
                assert.equal([1, 2, 3, 4, 5].sum(), 15);
            });
        });

        suite('unique', function() {
            test('should remove duplicate values', function() {
                assert.deepEqual(['apple', 'lemon', 'pear', 'lemon', 'apple'].unique(), ['apple', 'lemon', 'pear']);
            });
        });
    });

    suite('Number', function() {
        suite('limit', function() {
            test('should limit between min and max', function() {
                assert.equal((12).limit(2, 6.5), 6.5);
                assert.equal((-4).limit(2, 6.5), 2);
                assert.equal((4.3).limit(2, 6.5), 4.3);
            });
        });

        suite('round', function() {
            test('should round the number with optional precision', function() {
                assert.equal((12.45).round(), 12);
                assert.equal((12.45).round(1), 12.5);
                assert.equal((12.45).round(-1), 10);
            });
        });

        suite('times', function() {
            test('should execute the function x times', function() {
                var count = 0;

                (4).times(function() {
                    count += 2;
                });

                assert.equal(count, 8);
            })
        });

        suite('toFloat', function() {
            test('should convert int to float', function() {
                assert.equal((111).toFloat(), 111);
                assert.equal((111.1).toFloat(), 111.1);
            });
        });

        suite('toInt', function() {
            test('should convert float to int', function() {
                assert.equal((111).toInt(), 111);
                assert.equal((111.1).toInt(), 111);
                assert.equal((111).toInt(2), 7);
            });
        });

        suite('Math', function() {
            test('should inherit Math methods', function() {
                assert.equal((-1).abs(), 1);
                assert.equal((3).pow(4), 81);
            });
        });
    });

    suite('String', function() {

        suite('from', function() {

        });

        suite('uniqueID', function() {

        });
    });

    suite('Object', function() {

        suite('extend', function() {

        });

        suite('alias', function() {

        });

        suite('polyfill', function() {

        });

        suite('reset', function() {

        });

        suite('toQueryString', function() {

        });

        suite('append', function() {

        });

        suite('subset', function() {

        });

        suite('getLength', function() {

        });

        suite('keyOf', function() {

        });
    });
});
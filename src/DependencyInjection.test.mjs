import DependencyInjection from './DependencyInjection.mjs';

class A {
    constructor({ B }) { console.info('B', B); }
}

class B {
    constructor({ C }) { console.info('C', C); }
}

class C {
    constructor({ A }) { console.info('A', A); }
}

class Test {
}

describe('test', () => {
    describe('DependencyInjection', () => {
        it('should create root with di', () => {
            const di = DependencyInjection.createRoot({ Test });

            expect(di.get('di')).toBeInstanceOf(DependencyInjection);
            expect(di.get('Test')).toBeInstanceOf(Test);
        });

        it('should find circular dependencies', () => {
            const di = DependencyInjection.createRoot({ A, B, C });

            expect(function () { di.get(A) }).toThrow('Circular dependency found A -> B -> C -> A');
        });

        it('should find circular dependencies', () => {
            const di = DependencyInjection.createRoot({ A, B, C });

            expect(function () { di.get(A) }).toThrow('Circular dependency found A -> B -> C -> A');
        });

        it('should get variable from scope', () => {
            const di = DependencyInjection.createRoot({ Test });
            const scope = di.scope();
            scope.set('Test', 1);

            expect(scope.get('Test')).toEqual(1);
        });
    });
});

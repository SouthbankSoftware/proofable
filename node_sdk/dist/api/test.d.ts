declare class A {
    test(a: number): string;
    test(a: string, b: object): Error;
}
declare class B extends A {
    test(a: object): Error;
    test(a: number): string;
    test(a: string, b: object): Error;
}

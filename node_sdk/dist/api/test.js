"use strict";
class A {
    test(a, b) {
        return "superclass impl";
    }
}
class B extends A {
    test(a, b) {
        if (typeof a === "object") {
            return "subclass impl";
        }
        return super.test(a, b);
    }
}
//# sourceMappingURL=test.js.map
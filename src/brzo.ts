import {
    Expr,
    Empty,
    Epsilon,
    Or,
    Concat,
    nu,
} from "./util.ts"

export const brzo =
(...[a, ...as]: string[]) =>
(expr: Expr): Expr => {
    if (as.length > 1) {
        return brzo(...as)(brzo(a)(expr))
    }
    switch (expr.type) {
        case "Empty":
            return Empty
        case "Epsilon":
            return Empty
        case "Char":
            return expr.char == a
                ? Epsilon
                : Empty
        case "Or":
            return Or(
                brzo(a)(expr.left),
                brzo(a)(expr.right),
            )
        case "Concat":
            return Or(
                Concat(
                    brzo(a)(expr.left),
                    expr.right,
                ),
                Concat(
                    nu(expr.left)
                        ? Epsilon
                        : Empty,
                    brzo(a)(expr.right),
                ),
            )
        case "Star":
            return Concat(
                brzo(a)(expr.arg),
                expr,
            )
    }
}

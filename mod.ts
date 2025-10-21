type Expr =
    | { type: "Empty" }
    | { type: "Epsilon"}
    | { type: "Char", char: string }
    | { type: "Or", left: Expr, right: Expr }
    | { type: "Concat", left: Expr, right: Expr }
    | { type: "Star", arg: Expr }

const nu =
(expr: Expr): Expr => {
    switch (expr.type) {
        case "Empty":
            return { type: "Empty" }
        case "Epsilon":
            return { type: "Epsilon" }
        case "Char":
            return { type: "Empty" }
        case "Or":
            return {
                type: "Or",
                left: nu(expr.left),
                right: nu(expr.right),
            }
        case "Concat":
            return {
                type: "Concat",
                left: nu(expr.left),
                right: nu(expr.right),
            }
        case "Star":
            return { type: "Epsilon" }
    }
}

const deriv =
(a: string) =>
(expr: Expr): Expr => {
    switch (expr.type) {
        case "Empty":
            return { type: "Empty" }
        case "Epsilon":
            return { type: "Empty" }
        case "Char":
            return expr.char == a
                ? { type: "Epsilon" }
                : { type: "Empty" }
        case "Or":
            return {
                type: "Or",
                left: deriv(a)(expr.left),
                right: deriv(a)(expr.right),
            }
        case "Concat":
            return {
                type: "Or",
                left: {
                    type: "Concat",
                    left: deriv(a)(expr.left),
                    right: expr.right,
                },
                right: {
                    type: "Concat",
                    left: nu(expr.left),
                    right: deriv(a)(expr.right),
                },
            }
        case "Star":
            return {
                type: "Concat",
                left: deriv(a)(expr.arg),
                right: expr,
            }
    }
}

console.log(
    deriv("a")({
        type: "Concat",
        left: {
            type: "Or",
            left: {
                type: "Char",
                char: "a",
            },
            right: {
                type: "Char",
                char: "b",
            },
        },
        right: {
            type: "Star",
            arg: {
                type: "Char",
                char: "c",
            },
        },
    })
)

type Expr =
    | { type: "Empty" }
    | { type: "Epsilon" }
    | { type: "Char", char: string }
    | { type: "Or", left: Expr, right: Expr }
    | { type: "Concat", left: Expr, right: Expr }
    | { type: "Star", arg: Expr }

const Empty = { type: "Empty" } as const
const Epsilon = { type: "Epsilon" } as const
const Char =
(char: string) =>
    ({ type: "Char", char }) as const
const Or =
(left: Expr, right: Expr) =>
    ({ type: "Or", left, right }) as const
const Concat =
(left: Expr, right: Expr) =>
    ({ type: "Concat", left, right }) as const
const Star =
(arg: Expr) =>
    ({ type: "Star", arg }) as const

const nu =
(expr: Expr): Expr => {
    switch (expr.type) {
        case "Empty":
            return Empty
        case "Epsilon":
            return Epsilon
        case "Char":
            return Empty
        case "Or":
            return Or(
                nu(expr.left),
                nu(expr.right),
            )
        case "Concat":
            return Concat(
                nu(expr.left),
                nu(expr.right),
            )
        case "Star":
            return Epsilon
    }
}

const deriv =
(a: string) =>
(expr: Expr): Expr => {
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
                deriv(a)(expr.left),
                deriv(a)(expr.right),
            )
        case "Concat":
            return Or(
                Concat(
                    deriv(a)(expr.left),
                    expr.right,
                ),
                Concat(
                    nu(expr.left),
                    deriv(a)(expr.right),
                ),
            )
        case "Star":
            return Concat(
                deriv(a)(expr.arg),
                expr,
            )
    }
}

console.log(
    deriv("a")(Concat(
        Or(
            Char("a"),
            Char("b"),
        ),
        Star(
            Char("c"),
        ),
    ))
)

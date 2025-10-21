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
    left.type == "Empty" ? right :
    right.type == "Empty" ? left :
    ({ type: "Or", left, right }) as const
const Concat =
(left: Expr, right: Expr) =>
    left.type == "Empty" ? Empty :
    right.type == "Empty" ? Empty :
    left.type == "Epsilon" ? right :
    right.type == "Epsilon" ? left :
    ({ type: "Concat", left, right }) as const
const Star =
(arg: Expr) =>
    ({ type: "Star", arg }) as const

const nu =
(expr: Expr): boolean => {
    switch (expr.type) {
        case "Empty":
            return false
        case "Epsilon":
            return true
        case "Char":
            return false
        case "Or":
            return nu(expr.left) || nu(expr.right)
        case "Concat":
            return nu(expr.left) && nu(expr.right)
        case "Star":
            return true
    }
}

const deriv =
(...[a, ...as]: string[]) =>
(expr: Expr): Expr => {
    if (as.length > 1) {
        return deriv(...as)(deriv(a)(expr))
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
                    nu(expr.left)
                        ? Epsilon
                        : Empty,
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

const stringify =
(expr: Expr): string => {
    switch (expr.type) {
        case "Empty":
            return "∅"
        case "Epsilon":
            return "ε"
        case "Char":
            return expr.char
        case "Or":
            return `(${
                stringify(expr.left)
            }|${
                stringify(expr.right)
            })`
        case "Concat":
            return `(${
                stringify(expr.left)
            }${
                stringify(expr.right)
            })`
        case "Star":
            return stringify(expr.arg) + "*"
    }
}

console.log(
    stringify(
        deriv("a")(Or(
            Concat(
                Char("a"),
                Char("b"),
            ),
            Concat(
                Char("a"),
                Char("c"),
            )
        ))    
    )
)

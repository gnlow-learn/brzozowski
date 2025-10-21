export type Expr =
    | { type: "Empty" }
    | { type: "Epsilon" }
    | { type: "Char", char: string }
    | { type: "Or", left: Expr, right: Expr }
    | { type: "Concat", left: Expr, right: Expr }
    | { type: "Star", arg: Expr }

export const Empty = { type: "Empty" } as const
export const Epsilon = { type: "Epsilon" } as const
export const Char =
(char: string) =>
    ({ type: "Char", char }) as const
export const Or =
(left: Expr, right: Expr) =>
    left.type == "Empty" ? right :
    right.type == "Empty" ? left :
    ({ type: "Or", left, right }) as const
export const Concat =
(left: Expr, right: Expr) =>
    left.type == "Empty" ? Empty :
    right.type == "Empty" ? Empty :
    left.type == "Epsilon" ? right :
    right.type == "Epsilon" ? left :
    ({ type: "Concat", left, right }) as const
export const Star =
(arg: Expr) =>
    ({ type: "Star", arg }) as const

export const nu =
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

export const stringify =
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

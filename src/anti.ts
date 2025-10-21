import * as B from "./util.ts"

type Expr = Set<B.Expr>

const Set_flatMap =
<T>
(f: (t: T) => Set<T>) =>
(set: Set<T>) =>
    new Set(set.values().flatMap(f))

const Set_map =
<I, O>
(f: (t: I) => O) =>
(set: Set<I>) =>
    new Set(set.values().map(f))

export const Empty = new Set([B.Empty])
export const Epsilon = new Set([B.Epsilon])

export const Or =
(left: Expr, right: Expr) =>
    new Set(left.union(right)
        .values()
        .filter(x => x.type != "Empty")
    )

export const Concat =
(left: Expr, right: Expr): Expr =>
    Set_flatMap((l: B.Expr) =>
        Set_map((r: B.Expr) =>
            B.Concat(l, r)
        )(right)
    )(left)

export const anti =
(...[a, ...as]: string[]) =>
(expr: B.Expr): Expr => {
    if (as.length > 1) {
        return Set_flatMap(anti(...as))(anti(a)(expr))
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
                anti(a)(expr.left),
                anti(a)(expr.right),
            )
        case "Concat":
            return Or(
                Concat(
                    anti(a)(expr.left),
                    new Set([expr.right]),
                ),
                Concat(
                    B.nu(expr.left)
                        ? Epsilon
                        : Empty,
                    anti(a)(expr.right),
                ),
            )
        case "Star":
            return Concat(
                anti(a)(expr.arg),
                new Set([expr]),
            )
    }
}

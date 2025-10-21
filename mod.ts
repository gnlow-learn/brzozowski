import { brzo } from "./src/brzo.ts"
import {
    stringify,
    Or,
    Concat,
    Char,
} from "./src/util.ts"

console.log(
    stringify(
        brzo("a")(Or(
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

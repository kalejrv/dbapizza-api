import { Pizza } from "@types";

/* createPizza() */
export type NewPizza = Pick<Pizza, "flavor" | "image">;

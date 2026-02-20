import { db } from ".";
import { UnitOfWork } from "../../core/unit-of-work";
import { DrizzleTransaction } from "./types/drizzle-types";

export class DrizzleUnitOfWork implements UnitOfWork {
  async execute<T>(fn: (trx: DrizzleTransaction) => Promise<T>): Promise<T> {
    return db.transaction(async (tx) => {
      return fn(tx);
    });
  }
}
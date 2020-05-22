import "reflect-metadata";

import { DataStorage } from "./data-storage/data-storage";
import { Parser } from "./parser/parser";

const parser = new Parser();
parser.parse();

const dataStorage = new DataStorage();
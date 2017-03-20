module Nezaldi exposing (..)

import Json.Decode as Decode exposing (..)
import Maybe

type alias Traffic = Int

type alias ErrorCount = Int

type alias Header =
    { name: String
    , value: String
    }

type alias HeaderList = List Header

type alias HeaderSet =
    { source: HeaderList
    , target: HeaderList
    , response: HeaderList
    }

type alias Transaction =
    { id: Int
    , code: Int
    , sourceUrl: String
    , targetUrl: String
    , responseType: String
    , regex: String
    , times: TransactionTimes
    , headers: HeaderSet
    }

type alias TransactionTimes =
    { sourceRequestTime: Int
    , sourceResponseTime: Int
    , targetRequestTime: Int
    , targetResponseTime: Int
    }

type alias TransactionSet =
    { traffic: Int
    , errors: Int
    , transactions: List Transaction
    }

emptySet : TransactionSet
emptySet =
    { traffic = 0
    , errors = 0
    , transactions = []
    }

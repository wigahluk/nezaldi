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
    , target: Maybe HeaderList
    , response: Maybe HeaderList
    }

type alias Transaction =
    { id: Int
    , code: Int
    , sourceUrl: String
    , targetUrl: Maybe String
    , responseType: String
    , regex: Maybe String
    , times: TransactionTimes
    , headers: HeaderSet
    }

type alias TransactionTimes =
    { sourceRequestTime: Int
    , sourceResponseTime: Int
    , targetRequestTime: Maybe Int
    , targetResponseTime: Maybe Int
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

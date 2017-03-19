module Nezaldi exposing (..)

import Json.Decode as Decode

type alias Traffic = Int

type alias ErrorCount = Int

type alias Header = List String

type alias HeaderList = List Header

type alias HeaderSet =
    { source: HeaderList
    , target: HeaderList
    , response: HeaderList
    }

type alias Transaction =
    { code: Int
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

decodeHeaderSet : Decode.Decoder HeaderSet
decodeHeaderSet =
    Decode.map3 HeaderSet
            (Decode.field "source" (Decode.list (Decode.list Decode.string)))
            (Decode.field "target" (Decode.list (Decode.list Decode.string)))
            (Decode.field "response" (Decode.list (Decode.list Decode.string)))

decodeHeader : Decode.Decoder (List String)
decodeHeader =
    Decode.list Decode.string

decodeTimes : Decode.Decoder TransactionTimes
decodeTimes =
    Decode.map4 TransactionTimes
        (Decode.field "sourceRequestTime" Decode.int)
        (Decode.field "sourceResponseTime" Decode.int)
        (Decode.field "targetRequestTime" Decode.int)
        (Decode.field "targetResponseTime" Decode.int)

decodeTransaction : Decode.Decoder Transaction
decodeTransaction =
    Decode.map7 Transaction
        (Decode.field "code" Decode.int)
        (Decode.field "sourceUrl" Decode.string)
        (Decode.field "targetUrl" Decode.string)
        (Decode.field "responseType" Decode.string)
        (Decode.field "regex" Decode.string)
        decodeTimes
        (Decode.field "headers" decodeHeaderSet)

decodeTransactionSet : Decode.Decoder TransactionSet
decodeTransactionSet =
    Decode.map3 TransactionSet
        (Decode.field "traffic" Decode.int)
        (Decode.field "errors" Decode.int)
        (Decode.field "transactions" (Decode.list decodeTransaction))

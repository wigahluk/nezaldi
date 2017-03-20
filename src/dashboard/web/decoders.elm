module Decoders exposing (decodeTransactionSet)

import Json.Decode as Decode exposing (..)
import Maybe
import Nezaldi exposing (..)

listToHeader : List String -> Maybe Header
listToHeader list =
    case list of
        a::b::_ -> Just { name = a
                   , value = b
                   }
        a::_ -> Nothing
        [] -> Nothing

decodeHeaderSet : Decode.Decoder HeaderSet
decodeHeaderSet =
    Decode.map3 HeaderSet
            (Decode.field "source" decodeHeaderList)
            (Decode.field "target" decodeHeaderList)
            (Decode.field "response" decodeHeaderList)

decodeHeaderList : Decode.Decoder HeaderList
decodeHeaderList =
    let
        sequence : List (Maybe a) -> List a
        sequence list =
            case list of
                [] -> []
                (Just x)::t -> x :: (sequence t)
                Nothing ::t -> sequence t
    in map sequence (Decode.list decodeHeader)

decodeHeader : Decode.Decoder (Maybe Header)
decodeHeader =
    map listToHeader (Decode.list Decode.string)

decodeTimes : Decode.Decoder TransactionTimes
decodeTimes =
    Decode.map4 TransactionTimes
        (Decode.field "sourceRequestTime" Decode.int)
        (Decode.field "sourceResponseTime" Decode.int)
        (Decode.field "targetRequestTime" Decode.int)
        (Decode.field "targetResponseTime" Decode.int)

decodeTransaction : Decode.Decoder Transaction
decodeTransaction =
    Decode.map8 Transaction
        (Decode.field "id" Decode.int)
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

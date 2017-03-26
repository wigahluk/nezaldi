module Decoders exposing (decodeTransactionSet)

import Json.Decode exposing (..)
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

decodeHeaderSet : Decoder HeaderSet
decodeHeaderSet =
    map3 HeaderSet
            (field "source" decodeHeaderList)
            (maybe <| field "target" decodeHeaderList)
            (maybe <| field "response" decodeHeaderList)

decodeHeaderList : Decoder HeaderList
decodeHeaderList =
    let
        sequence : List (Maybe a) -> List a
        sequence list =
            case list of
                [] -> []
                (Just x)::t -> x :: (sequence t)
                Nothing ::t -> sequence t
    in map sequence (list decodeHeader)

decodeHeader : Decoder (Maybe Header)
decodeHeader =
    map listToHeader (list string)

decodeTimes : Decoder TransactionTimes
decodeTimes =
    map4 TransactionTimes
        (field "sourceRequestTime" int)
        (field "sourceResponseTime" int)
        (maybe <| field "targetRequestTime" int)
        (maybe <| field "targetResponseTime" int)

decodeTransaction : Decoder Transaction
decodeTransaction =
    map8 Transaction
        (field "id" int)
        (field "code" int)
        (field "sourceUrl" string)
        (maybe <| field "targetUrl" string)
        (field "responseType" string)
        (maybe <| field "regex" string)
        decodeTimes
        (field "headers" decodeHeaderSet)

decodeTransactionSet : Decoder TransactionSet
decodeTransactionSet =
    map3 TransactionSet
        (field "traffic" int)
        (field "errors" int)
        (field "transactions" (list decodeTransaction))

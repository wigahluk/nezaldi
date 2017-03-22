module Messages exposing (..)

import Time exposing (Time, second)
import Http
import Nezaldi exposing (TransactionSet)

type Msg
  = Tick Time
  | NewTransactions (Result Http.Error TransactionSet)
  | Select Int

import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import CreateReservation from "../reservations/CreateReservation";
import useQuery from "../utils/useQuery";
import CreateTable from "../tables/CreateTable";
import SeatReservation from "../tables/SeatReservation";
import SearchReservations from "../reservations/SearchReservations"

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {

  const query = useQuery();
  const date = query.get("date")

  return (
    <Switch>
      <Route exact path = "/">
        <Redirect to = {"/dashboard"} />
      </Route>
      <Route path = "/reservations/new">
        <CreateReservation />
      </Route>
      <Route path = "/search">
        <SearchReservations />
      </Route>
      <Route path = "/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path = "/tables/new">
        <CreateTable />
      </Route>
      <Route exact path = "/reservations">
        <Redirect to = {"/dashboard"} />
      </Route>
      <Route path = "/dashboard">
        <Dashboard date = {date || today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

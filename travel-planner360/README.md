Migration Note
--------------------

API changes

💡added fields------
*new weather field is added and available in   version  2 ,with the end point v2/trips/search


sample response
{
  "flights":[...],
  "hotels":[...],
  "weather":
    {
        "id": "632aaffd-b966-425b-9283-b5eba4993c8f",
        "date": "2025-10-14T00:00:00.000Z",
        "location": "HMBT",
        "tempMin": 30.8,
        "tempMax": 24.9,
        "condition": "Partly Cloudy"
    }
}

💡impact-------
*the existing endpoint v1/trips/search remain unchanged
*clients using v1 not recieve the weather condition results

💡upcomming plans-----
*suggested sutover date: 2025-12-10
*start integrating v2/trips/search for weather aware responses

💡deprecate plan for v1--------
*v1/search/trips will be supported until 2025-10-12 to 2025-12-10
*v2 includes weather integration and circuit breaker
*clients want to migrate to v2 before deprecation day to avoid distruption

💡notes--------
*v2 introduced a circuit breaker for weather service calls too prevent cascading failures.
*flights and hotels details continue to be returned,although the weather service is temporarily unavailable(degraded:true)




Rollout Plan
----------------------


💡Phase 1 -Parallel Deployemnet and  traffic monitoring

📌Deploy version 1 and version 2 side by side
      ✔ Version 1- flight service,Hotel service
      ✔ Version 2- fligh service, hotel service and weathere service
📌No impact on existing consumers
📌DOcumentation updated to show v2 availability

💡Phase 2 -v1 Deprecation +Adapter activation
📌





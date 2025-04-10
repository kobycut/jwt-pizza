# Incident: 2025-04-10 09-30-00

## Summary

```md

Between the hour of 09:30 and 11:00 on 4/10/2025, 43 users encountered pizza order failure. The event was triggered by a failure at 09:30. The failure contained a chaos monkey that was failing create order endpoint.

A bug in this code caused pizza purchases to not work. The event was detected by grafana pizza purchases per minute. The team started working on the event by observing the metrics and logs. This 5% incident affected 100% of users during this time.

There was further impact as noted by grafana metric alerts were raised in relation to this incident.
```

## Detection

```md
This incident was detected when the failure was triggered and koby was paged.

This could have been improved if more alerts were sent when the problem occurred.
```

## Impact

```md
For 1 and a half hours between 09:30 and 11:00 on 04/10/2025, pizza purchase failures were experienced by our users.

This incident affected 43 customers 100% of users during this time, who experienced pizza purchase.
```

## Timeline

```md
All times are UTC.

- _09:30_ - All pizza purchases started failing.
- _09:35_ - Alert of pizza purchases failing was sent.
- _10:30_ - Koby responded to the alert and began searching for the issue.
- _11:00_ - Issue was resolved.
```

## Response

```md
After receiving a page at 09:35 UTC, Koby came online at 10:30 UTC

This engineer discovered the issue and solved it.
```

## Root cause

```md
An open endpoint that could be accessed was used to fail the pizza purchases.
```

## Resolution

```md
This could have been resolved faster is the engineer on call recieved more urgent alerts.
```

## Prevention

```md
This issue could be prevented by placing safeguard on the endpoints.
```

## Action items

```md
1. More testing to find exactly where the system fails
2. Patch system failure points.
```

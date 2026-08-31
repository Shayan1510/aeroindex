from datetime import datetime, timezone

def money(v):
    try:
        return float(v or 0)
    except (TypeError, ValueError):
        return 0.0

def duration_minutes(iso_duration: str | None):
    if not iso_duration:
        return 0
    import re
    m = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?", iso_duration)
    if not m:
        return 0
    return int(m.group(1) or 0) * 60 + int(m.group(2) or 0)

def amadeus_to_flight(offer: dict, from_code: str, to_code: str):
    itinerary = offer["itineraries"][0]
    segments = itinerary.get("segments", [])
    first = segments[0]
    last = segments[-1]
    price = offer.get("price", {})
    base = money(price.get("base"))
    total = money(price.get("grandTotal") or price.get("total"))
    taxes = sum(money(t.get("amount")) for t in price.get("taxes", []))
    fees = max(0.0, total - base - taxes)
    dep = first["departure"]["at"]
    arr = last["arrival"]["at"]
    airline = first.get("carrierCode", "UNK")
    flight_no = f"{airline} {first.get('number','')}".strip()
    stops = max(0, len(segments) - 1)
    return {
        "id": str(offer.get("id") or f"{airline}-{from_code}{to_code}-{dep}"),
        "airlineCode": airline,
        "flightNumber": flight_no,
        "from": from_code,
        "to": to_code,
        "departTime": dep,
        "arriveTime": arr,
        "durationMinutes": duration_minutes(itinerary.get("duration")),
        "stops": stops,
        "cabin": "Economy",
        "baggage": "Check airline fare rules",
        "fare": {"base": round(base), "taxes": round(taxes), "fees": round(fees), "total": round(total)},
        "priceRating": "average",
        "source": "Amadeus",
        "lastUpdated": datetime.now(timezone.utc).isoformat(),
        "_raw": offer,
    }

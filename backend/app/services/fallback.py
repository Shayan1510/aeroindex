from datetime import datetime, timedelta, timezone
import hashlib
import random

AIRLINES = [
    ("6E", "IndiGo"), ("AI", "Air India"), ("QP", "Akasa Air"), ("SG", "SpiceJet")
]

def seeded(key):
    return random.Random(int(hashlib.sha256(key.encode()).hexdigest()[:12], 16))

def demo_flights(origin, destination, departure_date, n=8):
    rng = seeded(f"{origin}-{destination}-{departure_date}")
    route_avg = rng.randint(4500, 7800)
    out = []
    for i in range(n):
        code, _ = AIRLINES[i % len(AIRLINES)]
        hour = rng.randint(5, 21)
        minute = rng.choice([0, 15, 30, 45])
        dep = datetime.fromisoformat(f"{departure_date}T{hour:02d}:{minute:02d}:00").replace(tzinfo=timezone.utc)
        duration = rng.randint(90, 180)
        stops = 1 if rng.random() > .78 else 0
        arr = dep + timedelta(minutes=duration + stops * 45)
        base = int(route_avg * rng.uniform(.72, 1.35))
        taxes = int(base * .14)
        fees = rng.randint(199, 349)
        total = base + taxes + fees
        out.append({
            "id": f"{code}-{origin}{destination}-{i}-{departure_date}",
            "airlineCode": code,
            "flightNumber": f"{code} {100+rng.randint(0,899)}",
            "from": origin, "to": destination,
            "departTime": dep.isoformat(), "arriveTime": arr.isoformat(),
            "durationMinutes": duration + stops * 45, "stops": stops,
            "cabin": "Economy", "baggage": "15kg check-in + 7kg cabin",
            "fare": {"base": base, "taxes": taxes, "fees": fees, "total": total},
            "priceRating": "average", "source": "Demo DB",
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
        })
    return sorted(out, key=lambda x: x["departTime"])

def demo_history(route, days=60):
    rng = seeded(route)
    avg = rng.randint(4500, 7800)
    value = avg * rng.uniform(.9, 1.1)
    rows = []
    from datetime import date
    today = date.today()
    for i in range(days, -1, -1):
        value += (rng.random() - .5) * avg * .06
        value = max(avg*.6, min(avg*1.6, value))
        rows.append({"date": str(today - timedelta(days=i)), "price": round(value)})
    return rows

from datetime import datetime, timedelta
import httpx

class AmadeusProvider:
    def __init__(self, client_id: str | None, client_secret: str | None, base_url: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = base_url.rstrip("/")
        self._token = None
        self._expires_at = datetime.min

    @property
    def enabled(self):
        return bool(self.client_id and self.client_secret)

    async def token(self):
        if not self.enabled:
            raise RuntimeError("Amadeus credentials are not configured")
        if self._token and datetime.utcnow() < self._expires_at:
            return self._token
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.post(
                f"{self.base_url}/v1/security/oauth2/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                },
            )
            r.raise_for_status()
            data = r.json()
            self._token = data["access_token"]
            self._expires_at = datetime.utcnow() + timedelta(seconds=max(60, int(data.get("expires_in", 1800)) - 60))
            return self._token

    async def search(self, origin: str, destination: str, departure_date: str, adults: int = 1, max_results: int = 20):
        token = await self.token()
        params = {
            "originLocationCode": origin,
            "destinationLocationCode": destination,
            "departureDate": departure_date,
            "adults": adults,
            "currencyCode": "INR",
            "max": max_results,
        }
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.get(
                f"{self.base_url}/v2/shopping/flight-offers",
                params=params,
                headers={"Authorization": f"Bearer {token}"},
            )
            r.raise_for_status()
            return r.json()

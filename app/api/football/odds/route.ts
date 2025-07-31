export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fixtureId = searchParams.get("fixture")

  // Mock odds data - replace with API-Football odds endpoint
  const mockOdds = [
    {
      fixture: { id: Number.parseInt(fixtureId || "1") },
      bookmakers: [
        {
          id: 1,
          name: "Bet365",
          bets: [
            {
              id: 1,
              name: "Match Winner",
              values: [
                { value: "Home", odd: "2.10" },
                { value: "Draw", odd: "3.40" },
                { value: "Away", odd: "3.20" },
              ],
            },
          ],
        },
      ],
    },
  ]

  return Response.json({
    response: mockOdds,
  })
}

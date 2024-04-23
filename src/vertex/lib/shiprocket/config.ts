export async function getShipRocketAuthToken() {
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "karangill@gmail.com",
      password: "KARANarjun@@2023##",
    }),
  })

  const data = await (response.json() as Promise<{
    token: string
    status_code: number
  }>)

  if (data.status_code === 400) throw new Error("Access denied")

  return data.token
}

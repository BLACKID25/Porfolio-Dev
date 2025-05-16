1. Informacion que obtengo de Transbanck

POST /api/perfil 201 in 627ms
resultado de la transaccion transbank {
  token: '01ab457514429375a33b43e82b77f0d42b6b2d25a8a2c56a39011f5051bd47d9',
  url: 'https://webpay3gint.transbank.cl/webpayserver/initTransaction'
}
 POST /api/webpayplus/create 200 in 699ms
 GET /response?token_ws=01ab457514429375a33b43e82b77f0d42b6b2d25a8a2c56a39011f5051bd47d9 200 in 247ms
entro al resultado con el token 01ab457514429375a33b43e82b77f0d42b6b2d25a8a2c56a39011f5051bd47d9
 GET /favicon.ico 200 in 269ms
response del commit resultado {
  vci: 'TSY',
  amount: 11760,
  status: 'AUTHORIZED',
  buy_order: 'Order-1747087029631',
  session_id: 'Session-1747087029631-rlju5fpatkb',
  card_detail: { card_number: '6623' },
  accounting_date: '0512',
  transaction_date: '2025-05-12T21:57:08.994Z',
  authorization_code: '1213',
  payment_type_code: 'SI',
  response_code: 0,
  installments_amount: 3920,
  installments_number: 3
}
 GET /api/webpayplus/result?token_ws=01ab457514429375a33b43e82b77f0d42b6b2d25a8a2c56a39011f5051bd47d9 200 in 1543ms


 2. Respuesta de MercadoPago

 POST /api/perfil 201 in 935ms
 ✓ Compiled /api/mercadopago in 428ms
🔐 Token de acceso de MercadoPago: APP_USR-2900667922829352-041919-59307edd39b28d1d017311797b6d4157-2394933495
Entro a la API de MercadoPago
Precio del plan 34300
Respuesta de MercadoPago: {
  id: '6f9b5da7356e40fdb65bc775b313a7dd',
  payer_id: 1626187072,
  payer_email: '',
  back_url: 'https://arab-television-valves-packed.trycloudflare.com/response',
  collector_id: 2394933495,
  application_id: 2900667922829352,
  status: 'pending',
  reason: 'Empresarial',
  date_created: '2025-05-16T09:44:43.569-04:00',
  last_modified: '2025-05-16T09:44:43.791-04:00',
  init_point: 'https://www.mercadopago.cl/subscriptions/checkout?preapproval_id=6f9b5da7356e40fdb65bc775b313a7dd',
  auto_recurring: {
    frequency: 1,
    frequency_type: 'months',
    transaction_amount: 34300,
    currency_id: 'CLP',
    start_date: '2025-05-16T09:44:43.569-04:00',
    end_date: '2026-05-16T09:44:43.221-04:00',
    free_trial: null
  },
  summarized: {
    quotas: 12,
    charged_quantity: null,
    pending_charge_quantity: 12,
    charged_amount: null,
    pending_charge_amount: 411600,
    semaphore: null,
    last_charged_date: null,
    last_charged_amount: null
  },
  next_payment_date: '2025-05-16T09:44:43.000-04:00',
  payment_method_id: null,
  payment_method_id_secondary: null,
  first_invoice_offset: null,
  subscription_id: '6f9b5da7356e40fdb65bc775b313a7dd',
  owner: null,
  api_response: {
    status: 201,
    headers: [Object: null prototype] {
      date: [Array],
      'content-type': [Array],
      'transfer-encoding': [Array],
      connection: [Array],
      'x-request-id': [Array],
      'x-content-type-options': [Array],
      'x-xss-protection': [Array],
      'strict-transport-security': [Array],
      'access-control-allow-origin': [Array],
      'access-control-allow-headers': [Array],
      'access-control-allow-methods': [Array],
      'access-control-max-age': [Array],
      'timing-allow-origin': [Array]
    }
  }
}
 POST /api/mercadopago 200 in 2369ms
 ✓ Compiled /api/webhooks in 157ms
✅ Webhook recibido:
Query params: {
  type: 'subscription_preapproval',
  dataId: '6f9b5da7356e40fdb65bc775b313a7dd'
}
Body completo: {
  action: 'created',
  application_id: 2900667922829352,
  data: { id: '6f9b5da7356e40fdb65bc775b313a7dd' },
  date: '2025-05-16T13:44:43Z',
  entity: 'preapproval',
  id: 121387123922,
  type: 'subscription_preapproval',
  version: 0
}
 POST /api/webhooks?data.id=6f9b5da7356e40fdb65bc775b313a7dd&type=subscription_preapproval 200 in 218ms


 

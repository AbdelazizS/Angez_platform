@component('mail::message')
# {{ __('📥 New Order Received') }}

{{ $freelancer->name }},  
{{ __('You’ve received a new order for your service.') }}

---

**Service**: {{ $service->title }}

**Client**: {{ $client->name }} ({{ $client->email }})

**Order Details**:  
{{ $order->description }}

**Order ID**: #{{ $order->id }}  
**Placed at**: {{ $order->created_at->format('F j, Y, g:i A') }}

@component('mail::button', ['url' => route('dashboard.orders.show', $order->id)])
View Order
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent

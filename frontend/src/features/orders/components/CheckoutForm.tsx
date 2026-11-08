import { useState } from "react";
import type {
  CheckoutRequest,
  DeliveryAddress,
  PaymentMethod,
  SavedAddress,
} from "../types";

interface CheckoutFormProps {
  addresses: SavedAddress[];
  onSubmit: (data: CheckoutRequest) => void;
  isSubmitting: boolean;    
}

const emptyAddress: DeliveryAddress = {
  recipient: "",
  phone: "",
  address: "",
  city: "",
  district: "",
  ward: "",
};

export default function CheckoutForm({
  addresses,
  onSubmit,
  isSubmitting,
}: CheckoutFormProps) {
  const defaultAddress = addresses.find((address) => address.isDefault);

  const [useNewAddress, setUseNewAddress] = useState(addresses.length === 0);
  const [selectedAddressId, setSelectedAddressId] = useState(
    defaultAddress?.id || addresses[0]?.id || "",
  );
  const [address, setAddress] = useState<DeliveryAddress>(emptyAddress);
  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  function handleAddressChange(field: keyof DeliveryAddress, value: string) {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (useNewAddress) {
      onSubmit({
        paymentMethod,
        address,
        saveAddress,
      });
    } else {
      onSubmit({
        paymentMethod,
        addressId: selectedAddressId,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Delivery address */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Delivery Information</h2>

        {addresses.length > 0 && (
          <div className="mb-6 space-y-3">
            {addresses.map((item) => (
              <label
                key={item.id}
                className="flex cursor-pointer gap-3 border p-4"
              >
                <input
                  type="radio"
                  name="address"
                  checked={!useNewAddress && selectedAddressId === item.id}
                  onChange={() => {
                    setSelectedAddressId(item.id);
                    setUseNewAddress(false);
                  }}
                />

                <div className="text-sm">
                  <p className="font-medium">
                    {item.recipient} · {item.phone}
                  </p>
                  <p className="text-neutral-500">
                    {item.address}, {item.ward}, {item.district}, {item.city}
                  </p>
                  {item.isDefault && (
                    <span className="text-xs text-neutral-500">
                      Default address
                    </span>
                  )}
                </div>
              </label>
            ))}

            <button
              type="button"
              onClick={() => setUseNewAddress(true)}
              className="text-sm underline"
            >
              + Use a new address
            </button>
          </div>
        )}

        {useNewAddress && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm">Recipient name</label>
              <input
                required
                value={address.recipient}
                onChange={(e) =>
                  handleAddressChange("recipient", e.target.value)
                }
                className="w-full border p-3"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm">Phone number</label>
              <input
                required
                type="tel"
                value={address.phone}
                onChange={(e) => handleAddressChange("phone", e.target.value)}
                className="w-full border p-3"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm">Street address</label>
              <input
                required
                value={address.address}
                onChange={(e) => handleAddressChange("address", e.target.value)}
                className="w-full border p-3"
                placeholder="House number, street name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm">City / Province</label>
                <input
                  required
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className="w-full border p-3"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm">District</label>
                <input
                  required
                  value={address.district}
                  onChange={(e) =>
                    handleAddressChange("district", e.target.value)
                  }
                  className="w-full border p-3"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm">Ward (optional)</label>
              <input
                value={address.ward}
                onChange={(e) => handleAddressChange("ward", e.target.value)}
                className="w-full border p-3"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={(e) => setSaveAddress(e.target.checked)}
              />
              Save this address to my account
            </label>
          </div>
        )}
      </section>

      {/* Payment method */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Payment Method</h2>

        <div className="space-y-3">
          <label className="flex cursor-pointer items-center gap-3 border p-4">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            <span className="text-sm">Cash on Delivery (COD)</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 border p-4">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "BANK_TRANSFER"}
              onChange={() => setPaymentMethod("BANK_TRANSFER")}
            />
            <span className="text-sm">Bank Transfer</span>
          </label>
        </div>
      </section>

      <button
        type="submit"
        disabled={isSubmitting || (!useNewAddress && !selectedAddressId)}
        className="w-full bg-black p-4 text-white disabled:opacity-50"
      >
        {isSubmitting ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}

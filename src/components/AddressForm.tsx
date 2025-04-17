import React, { useState } from 'react';
import { post } from '@aws-amplify/api';

type Address = {
  country: string;
  street: string;
  postalCode: string;
};

type AddressFormProps = {
  userId: string;
  onSuccess?: () => void;
};

export const AddressForm = ({ userId, onSuccess }: AddressFormProps) => {
  const [addresses, setAddresses] = useState<Address[]>([
    { country: '', street: '', postalCode: '' }
  ]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (index: number, field: keyof Address, value: string) => {
    const updated = [...addresses];
    updated[index][field] = value;
    setAddresses(updated);
  };

  const addNewAddress = () => {
    setAddresses([...addresses, { country: '', street: '', postalCode: '' }]);
  };

  const removeAddress = (index: number) => {
    const updated = [...addresses];
    updated.splice(index, 1);
    setAddresses(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await post({
        path: "/user/addresses",
        apiName: "users",
        options: {
          body: {
            userId,
            addresses
          }
        }
      }).response;

      if (response.statusCode === 201) {
        setSuccess(true);
        setAddresses([{ country: '', street: '', postalCode: '' }]);
        if (onSuccess) onSuccess();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("Erreur lors de l'ajout des adresses.");
      }
    } catch (err) {
      console.error("Erreur API:", err);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Ajouter des adresses 🏡</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {addresses.map((address, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4 relative">
            {addresses.length > 1 && (
              <button
                type="button"
                onClick={() => removeAddress(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                ✖
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Pays"
                value={address.country}
                onChange={(e) => handleChange(index, 'country', e.target.value)}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                placeholder="Rue"
                value={address.street}
                onChange={(e) => handleChange(index, 'street', e.target.value)}
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                placeholder="Code postal"
                value={address.postalCode}
                onChange={(e) => handleChange(index, 'postalCode', e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addNewAddress}
            className="text-blue-600 hover:underline"
            disabled={loading}
          >
            + Ajouter une adresse
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-xl transition text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Enregistrer
          </button>
        </div>
      </form>

      {success && (
        <div className="mt-4 text-green-600 font-medium">
          ✅ Adresses enregistrées avec succès !
        </div>
      )}
    </div>
  );
};

import { useNavigate } from "react-router";
import ProductForm from "./components/ProductForm";

export default function CreatePage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/products");
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <ProductForm
        mode="create"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}

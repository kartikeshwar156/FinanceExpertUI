import { useState, useRef } from "react";
import { useAuth } from "../../store/store";
import { apiRefreshCalls } from "../../services/ApiServices/ApiRefreshCalls";

export default function AdminTab({ visible }: { visible: boolean }) {
  const { userInfo } = useAuth((state) => ({ userInfo: state.userInfo }));
  const [makeAdminEmail, setMakeAdminEmail] = useState("");
  const [removeAdminEmail, setRemoveAdminEmail] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadText, setUploadText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = useAuth((state) => state.token);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleMakeAdmin = async () => {
    if (!makeAdminEmail) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await apiRefreshCalls.makeApiCall("http://localhost:8080/v1/admin/make-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}), 
        },
        body: JSON.stringify({ 
          gmail: makeAdminEmail ,
          adminGmail: userInfo?.gmail,
        }),
      });

      console.log(res);
      console.log(token);
      // console.log(userInfo?.gmail)

      const data = await res.json();
      setMessage(data.message || "Successfully made Admin");
    } catch (err) {
      setMessage("Failed to make admin");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!removeAdminEmail) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await apiRefreshCalls.makeApiCall("http://localhost:8080/v1/admin/remove-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}), 
        },
        body: JSON.stringify({ 
          gmail: makeAdminEmail ,
          adminGmail: userInfo?.gmail,
        }),
      });
      const data = await res.json();
      setMessage(data.message || "Successfully Removed from Admin");
    } catch (err) {
      setMessage("Failed to remove admin");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadFile(file || null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadText(event.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setUploadText("");
    }
  };

  const handleUpload = async () => {
    if (!uploadText || !userInfo?.gmail) return;
    setLoading(true);
    setMessage("");
    console.log("Upload buttonn is clicked")
    // Validation: check if uploadText is a valid array of objects with required fields and no duplicates
    try {
      const data = JSON.parse(uploadText);
      if (!Array.isArray(data)) {
        setMessage("File Upoloaded is not array");
        setLoading(false);
        setUploadText("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const requiredFields = [
        "ticker",
        "companyName",
        "industry",
        "about",
        "headquarters",
        "foundedYear",
        "founder",
      ];
      const seenTickers = new Set();
      for (const obj of data) {
        // Check all required fields exist
        for (const field of requiredFields) {
          if (!(field in obj)) {
            setMessage("Invalid file structure or Required Keys not present");
            setLoading(false);
            setUploadText("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
        }
        if(Object.keys(obj).length != 7){
            setMessage("Invalid file structure or Unwanted Keys are present");
            setLoading(false);
            setUploadText("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }
        // Check 'about' is an array
        if (!Array.isArray(obj.about)) {
          setMessage("Invalid About Key");
          setLoading(false);
          setUploadText("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        // Check 'foundedYear' is a number
        if (typeof obj.foundedYear !== "number") {
          setMessage("Invalid foundedYear Key");
          setLoading(false);
          setUploadText("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        // Check for duplicate ticker
        const ticker = obj.ticker;
        if (!ticker || seenTickers.has(ticker)) {
          setMessage("Duplicates found. Please upload again.");
          setLoading(false);
          setUploadText("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        seenTickers.add(ticker);
      }
      // If validation passes, proceed to upload
      const res = await apiRefreshCalls.makeApiCall("http://localhost:8080/v1/admin/upload-data", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}), 
        },
        body: JSON.stringify({ adminGmail: userInfo.gmail, companyUploadData: data }),
      });
      const result = await res.json();
      setMessage(result.message || "Upload successful");
      // Reset file input after successful upload
      setUploadText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setMessage("Some error has occured");
      setUploadText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 ${!visible ? "hidden" : ""}`}>
      <h2 className="text-xl font-bold mb-4">Admin Actions</h2>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Make User Admin</h3>
        <input
          type="email"
          placeholder="Enter user gmail"
          value={makeAdminEmail}
          onChange={(e) => setMakeAdminEmail(e.target.value)}
          className="border rounded p-2 mr-2"
        />
        <button
          onClick={handleMakeAdmin}
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Make Admin
        </button>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Remove Admin</h3>
        <input
          type="email"
          placeholder="Enter user gmail"
          value={removeAdminEmail}
          onChange={(e) => setRemoveAdminEmail(e.target.value)}
          className="border rounded p-2 mr-2"
        />
        <button
          onClick={handleRemoveAdmin}
          className="bg-red-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Remove Admin
        </button>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Upload .txt Data</h3>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="mb-2"
          ref={fileInputRef}
        />
        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded"
          // disabled={loading || !uploadText}
        >
          Upload
        </button>
      </div>
      {message && <div className="mt-4 text-center font-semibold">{message}</div>}
    </div>
  );
}

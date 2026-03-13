import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, MapPin, IndianRupee, Bed, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AMENITIES = ["WiFi", "AC", "Laundry", "Meals", "Parking", "Gym", "Power Backup", "Hot Water", "CCTV", "Housekeeping"];

const ListPG = () => {
  const { user, isReady } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    locality: "",
    rent_per_month: "",
    gender_type: "any",
    room_type: "sharing",
    total_beds: "1",
    amenities: [] as string[],
  });

  if (isReady && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4">
            <Home className="w-6 h-6 text-secondary-foreground" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Login Required</h2>
          <p className="text-muted-foreground text-sm mb-4">You need to sign in to list your PG property.</p>
          <Button onClick={() => navigate("/auth")} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const rent = parseInt(form.rent_per_month);
    const beds = parseInt(form.total_beds);
    if (isNaN(rent) || rent <= 0) {
      toast({ title: "Invalid rent", description: "Please enter a valid rent amount.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("pg_listings").insert({
      owner_id: user.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      address: form.address.trim(),
      locality: form.locality.trim() || null,
      rent_per_month: rent,
      gender_type: form.gender_type,
      room_type: form.room_type,
      total_beds: isNaN(beds) ? 1 : beds,
      available_beds: isNaN(beds) ? 1 : beds,
      amenities: form.amenities,
    });

    if (error) {
      toast({ title: "Failed to submit", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "PG Listed!", description: "Your property has been submitted for review." });
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <a href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to home</span>
        </a>

        <h1 className="font-display text-2xl font-bold text-foreground mb-1">List Your PG</h1>
        <p className="text-muted-foreground text-sm mb-8">Fill in the details to list your property on Gharpayy.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Property Details</h2>
            <div className="space-y-2">
              <Label htmlFor="title">Property Name *</Label>
              <Input id="title" placeholder="e.g. Sunshine PG for Men" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your PG - facilities, rules, nearby landmarks..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={2000} rows={4} />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" /> Location
            </h2>
            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Input id="address" placeholder="Building name, street, area" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required maxLength={500} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="locality">Locality / Area</Label>
              <Input id="locality" placeholder="e.g. Koramangala, HSR Layout" value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} maxLength={200} />
            </div>
          </div>

          {/* Room & Pricing */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-secondary" /> Room & Pricing
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rent">Rent / Month (₹) *</Label>
                <Input id="rent" type="number" placeholder="8000" value={form.rent_per_month} onChange={(e) => setForm({ ...form, rent_per_month: e.target.value })} required min={1} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beds">Total Beds</Label>
                <Input id="beds" type="number" placeholder="10" value={form.total_beds} onChange={(e) => setForm({ ...form, total_beds: e.target.value })} min={1} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Gender Type</Label>
                <Select value={form.gender_type} onValueChange={(v) => setForm({ ...form, gender_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="any">Co-ed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Room Type</Label>
                <Select value={form.room_type} onValueChange={(v) => setForm({ ...form, room_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="triple">Triple</SelectItem>
                    <SelectItem value="sharing">Sharing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <Bed className="w-4 h-4 text-secondary" /> Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox
                    checked={form.amenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 text-base"
          >
            {loading ? "Submitting..." : "Submit Listing"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ListPG;

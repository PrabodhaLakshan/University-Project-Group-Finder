"use client";

import { useState } from "react";
import { MapPin, Clock, AlertCircle, X, Plus } from "lucide-react";

interface HandoverFormProps {
  onSubmit: (details: HandoverDetails) => void;
  isProcessing: boolean;
  sellerLocation?: string;
}

export interface HandoverDetails {
  meetingDates: string[];
  meetingLocations: string[];
  additionalNotes?: string;
}

export default function HandoverForm({ onSubmit, isProcessing, sellerLocation = "Campus" }: HandoverFormProps) {
  const [meetingDates, setMeetingDates] = useState<string[]>([]);
  const [meetingLocations, setMeetingLocations] = useState<string[]>([""]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  const handleAddDate = (date: string) => {
    if (date && !meetingDates.includes(date)) {
      setMeetingDates([...meetingDates, date].sort());
    }
  };

  const handleRemoveDate = (date: string) => {
    setMeetingDates(meetingDates.filter((d) => d !== date));
  };

  const handleLocationChange = (index: number, value: string) => {
    const newLocations = [...meetingLocations];
    newLocations[index] = value;
    setMeetingLocations(newLocations);
  };

  const handleAddLocation = () => {
    setMeetingLocations([...meetingLocations, ""]);
  };

  const handleRemoveLocation = (index: number) => {
    if (meetingLocations.length > 1) {
      setMeetingLocations(meetingLocations.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validDates = meetingDates.filter((d) => d.trim());
    const validLocations = meetingLocations.filter((l) => l.trim());

    if (validDates.length === 0) {
      setError("Please select at least one meeting date");
      return;
    }

    if (validLocations.length === 0) {
      setError("Please specify at least one meeting location");
      return;
    }

    onSubmit({
      meetingDates: validDates,
      meetingLocations: validLocations,
      additionalNotes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-300/50 bg-red-500/10 backdrop-blur-md p-4 flex gap-3 text-red-700">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div className="font-medium">{error}</div>
        </div>
      )}

      {/* Date Selection */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg p-6 hover:shadow-xl transition-all">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={20} className="text-blue-600" />
          <label className="text-sm font-semibold text-gray-900">Select Meeting Dates</label>
        </div>
        <p className="text-xs text-gray-600 mb-4">Choose dates when you're available to meet the seller</p>
        
        {/* 14-Day Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {Array.from({ length: 14 }).map((_, index) => {
            const date = new Date(new Date().toDateString());
            date.setDate(date.getDate() + index);
            const dateStr = date.toISOString().split("T")[0];
            const isSelected = meetingDates.includes(dateStr);
            
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    handleRemoveDate(dateStr);
                  } else {
                    handleAddDate(dateStr);
                  }
                }}
                className={`p-3 rounded-lg font-medium text-center transition-all border-2 ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/20 text-blue-900"
                    : "border-white/40 bg-white/30 text-gray-700 hover:bg-blue-500/10 hover:border-blue-300"
                }`}
              >
                <div className="text-sm font-bold">{date.getDate()}</div>
                <div className="text-xs text-gray-600 group-hover:text-gray-700">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
              </button>
            );
          })}
        </div>

        {meetingDates.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 mb-2 font-medium">Selected: {meetingDates.length} date(s)</p>
            <div className="flex flex-wrap gap-2">
              {meetingDates.map((date) => (
                <div
                  key={date}
                  className="bg-blue-500/15 border border-blue-300/50 rounded-lg px-4 py-2 flex items-center gap-2"
                >
                  <span className="text-sm font-medium text-blue-900">
                    {new Date(date + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDate(date)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Location Selection */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg p-6 hover:shadow-xl transition-all">
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={20} className="text-purple-600" />
          <label className="text-sm font-semibold text-gray-900">
            Where can you meet the seller in {sellerLocation}?
          </label>
        </div>
        <p className="text-xs text-gray-600 mb-4">Add multiple meeting location options</p>

        <div className="space-y-3">
          {meetingLocations.map((location, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={location}
                onChange={(e) => handleLocationChange(index, e.target.value)}
                placeholder={
                  index === 0
                    ? "e.g., Main Library - Study Area, 3rd Floor"
                    : "e.g., Cafeteria, Student Center"
                }
                className="flex-1 rounded-xl bg-white/50 border border-white/40 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/70 transition"
                disabled={isProcessing}
              />
              {meetingLocations.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveLocation(index)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-600 p-3 rounded-xl transition flex-shrink-0"
                  disabled={isProcessing}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddLocation}
          disabled={isProcessing}
          className="mt-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium hover:underline transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Add another location
        </button>
      </div>

      {/* Additional Notes */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg p-6 hover:shadow-xl transition-all">
        <label className="text-sm font-semibold text-gray-900 block mb-4">Additional Notes (Optional)</label>
        <textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Any special instructions or questions for the seller?"
          className="w-full rounded-xl bg-white/50 border border-white/40 px-4 py-3 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/70 transition resize-none"
          rows={3}
          disabled={isProcessing}
        />
      </div>

      {/* Safety Tip */}
      <div className="bg-blue-500/10 backdrop-blur-md rounded-2xl border border-blue-300/30 p-6">
        <p className="text-sm text-blue-900">
          <strong>Safety Tip:</strong> Meet in public, well-lit locations on campus. Inspect the item thoroughly before making payment. Verify the seller's identity and ask any questions about the product's condition.
        </p>
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isProcessing ? "Processing..." : "Request to Seller"}
      </button>
    </form>
  );
}

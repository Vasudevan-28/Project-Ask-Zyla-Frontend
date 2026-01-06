import React, { useEffect, useState, useContext } from "react";
import SearchBar from "../dashboard_components/SearchBar";
import Calendar from "../dashboard_components/Calendar";
import ToDoCard from "../dashboard_components/ToDoCard";
import RoutinesPanel from "../dashboard_components/RoutinesPanel";
import StreakBar from "../dashboard_components/StreakBar";
import AddProductModal from "../dashboard_components/AddProductModal";
import { ApiService } from "../services/dashboardApi";
import { ThemeContext } from "../contexts/ThemeContext";
import { getAuth } from "firebase/auth";
import { toISODate } from "../utils/DateUtils";

export default function DashboardPage() {
  const { theme } = useContext(ThemeContext);
  const isLight = theme === "light";

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [routines, setRoutines] = useState({
    morning: [],
    afternoon: [],
    evening: [],
  });
  const [userToken, setUserToken] = useState(null);
  const [completedDates, setCompletedDates] = useState([]);

  const selectedIso = toISODate(selectedDate);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken(false);
        setUserToken(token);
      } else {
        setUserToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function onOpenAddProduct() {
      setShowAddProduct(true);
    }
    window.addEventListener("askzyla:open-add-product", onOpenAddProduct);
    return () => {
      window.removeEventListener("askzyla:open-add-product", onOpenAddProduct);
    };
  }, []);

  useEffect(() => {
    function onOpenAddProduct() {
      setShowAddProduct(true);
    }

    async function onTodosUpdated() {
      if (userToken) {
        fetchCompletedDates();
      }
    }

    window.addEventListener("askzyla:open-add-product", onOpenAddProduct);
    window.addEventListener("zyla:todos-updated", onTodosUpdated);
    return () => {
      window.removeEventListener("askzyla:open-add-product", onOpenAddProduct);
      window.removeEventListener("zyla:todos-updated", onTodosUpdated);
    };
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      fetchRoutines();
      fetchCompletedDates();
    }
  }, [userToken]);

  async function fetchRoutines() {
    try {
      const data = await ApiService.getProducts(userToken);
      setRoutines(data);
    } catch (err) {
      console.error("Failed to fetch routines", err);
    }
  }

  async function fetchCompletedDates() {
    try {
      const dates = await ApiService.getCompletedDates(userToken);
      setCompletedDates(dates);
    } catch (err) {
      console.error("Failed to fetch completed dates", err);
    }
  }

  function handleSearch(dateObj) {
    setSelectedDate(dateObj);
  }

  async function handleAddProduct(product) {
    try {
      await ApiService.addProduct(product, userToken);
      await fetchRoutines();
    } catch (err) {
      console.error("Failed to add product", err);
      setShowAddProduct(false);
    }
  }

  async function handleRemoveProduct(routineKey, id) {
    try {
      await ApiService.deleteProduct(id, userToken);
      await fetchRoutines();
    } catch (err) {
      console.error("Failed to remove product", err);
    }
  }

  return (
    <div
      className={`min-w-fit mx-auto overflow-x-hidden pt-20 py-8 flex justify-center w-full
    ${isLight ? "bg-[#e9d9e3]" : "bg-[#1d0e2d]"}
    `}
    >
      <div className="hidden md:block">
        <div
          className=" grid gap-6 items-stretch"
          style={{
            gridTemplateColumns: "minmax(360px, 1fr) minmax(360px, 1fr) 320px",
            gridTemplateRows: "auto minmax(0, 1fr) auto",
          }}
        >
          {/* Search */}
          <div className="col-span-2 row-start-1 row-end-2 flex items-center">
            <div className="w-full">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Routines */}
          <div className="col-start-3 col-end-4 row-start-1 row-end-3 flex flex-col min-h-0">
            <RoutinesPanel
              routines={routines}
              onRemove={handleRemoveProduct}
              onOpenAddProduct={() => setShowAddProduct(true)}
            />
          </div>

          {/* Calendar */}
          <div className="col-start-1 col-end-2 row-start-2 row-end-3 min-h-0">
            <Calendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              completedDates={completedDates}
            />
          </div>

          {/* Todo */}
          <div className="col-start-2 col-end-3 row-start-2 row-end-3 min-h-0">
            <ToDoCard selectedDate={selectedDate} userToken={userToken} />
          </div>

          {/* Streak / Daily Progress */}
          <div className="col-start-1 col-end-3 row-start-3 row-end-4">
            <StreakBar userToken={userToken} selectedIso={selectedIso} />
          </div>

          {/* Buttons */}
          <div className="col-start-3 col-end-4 row-start-3 row-end-4 flex items-center justify-center">
            <div className="flex gap-3" style={{ transform: "translateX(5px)" }}>
              <button
                onClick={() => setShowAddProduct(true)}
                className={`py-2 px-4  font-semibold ${
                  isLight
                    ? "bg-linear-to-b from-[#a78bfa] to-[#8b5cf6] text-white"
                    : "bg-white/5 text-slate-50"
                } rounded-lg`}
                type="button"
              >
                Add Routine
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 block md:hidden max-w-xl">
        {/* Search at top */}
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Streak / Daily Progress */}
        <div className="mb-4">
          <StreakBar userToken={userToken} selectedIso={selectedIso} />
        </div>

        {/* Calendar */}
        <div className="mb-4">
          <Calendar
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            completedDates={completedDates}
          />
        </div>

        {/* Todo */}
        <div className="mb-4">
          <ToDoCard selectedDate={selectedDate} userToken={userToken} />
        </div>

        <div className="mb-6">
          <RoutinesPanel
            routines={routines}
            onRemove={handleRemoveProduct}
            onOpenAddProduct={() => setShowAddProduct(true)}
          />
        </div>

        <div className="mb-24 flex justify-center">
          <button
            onClick={() => setShowAddProduct(true)}
            className={`w-full max-w-xs py-3 px-4 font-semibold ${
              isLight
                ? "bg-linear-to-b from-[#a78bfa] to-[#8b5cf6] text-white"
                : "bg-white/5 text-slate-50"
            } rounded-lg`}
            type="button"
          >
            Add Routine
          </button>
        </div>
      </div>

      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onAdd={handleAddProduct}
          routines={routines}
        />
      )}
    </div>
  );
}
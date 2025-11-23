"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import api from "@/_lib/api";
import { AnalyticsResponse, Coupon, Pagination } from "@/_lib/types";
import { mapFilterToQuery } from "@/_lib/utils/helper";

export default function RewardManagement() {
  const [tab, setTab] = useState("active");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isMounted, setIsMounted] = useState(false);
  const businessOwnerId =
    typeof window !== "undefined" && localStorage.getItem("businessOwner")
      ? JSON.parse(localStorage.getItem("businessOwner")!)._id
      : "";
  useEffect(() => {
    fetchCoupons();
    fetchAnalytics();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!businessOwnerId) return;
    const timeout = setTimeout(() => {
      fetchCoupons(1, search, filter);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, filter, isMounted]);

  const fetchAnalytics = async () => {
    try {
      const owner = localStorage.getItem("businessOwner");
      if (owner) {
        const businessOwnerId = JSON.parse(owner)._id;
        const res = await api.get(
          `/consumer-engagement/analytics?businessOwnerId=${businessOwnerId}&period=30d`
        );
        if (res?.data?.status) {
          setAnalytics(res.data.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCoupons = async (
    page = 1,
    searchText = "",
    filterValue = "all"
  ) => {
    try {
      setLoading(true);

      const filterQuery = mapFilterToQuery(filterValue);

      let queryString = `/coupons?page=${page}`;

      if (searchText) {
        queryString += `&code=${searchText}`;
      }
      if (filterQuery) {
        queryString += `&${filterQuery}`;
      }

      const res = await api.get(queryString);

      if (res?.data?.status) {
        setCoupons(res.data.data.coupons);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex gap-6 w-full">
      <div className="flex-1">
        <div className="mb-4 bg-purple-50 p-3 rounded-lg text-sm text-purple-700">
          Note: In MVP, coupons are assigned during product upload via CSV.
          Future versions will have dedicated coupon creation.
        </div>

        <div className="flex gap-3 mb-4">
          <Button
            variant={tab === "active" ? "default" : "outline"}
            onClick={() => setTab("active")}
          >
            Active Coupons
          </Button>
          <Button
            variant={tab === "recent" ? "default" : "outline"}
            onClick={() => setTab("recent")}
          >
            Recent Redemptions
          </Button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button>Export</Button>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                {filter === "all"
                  ? "All Coupons"
                  : filter === "active"
                  ? "Active"
                  : filter === "inactive"
                  ? "Inactive"
                  : filter === "redeemed"
                  ? "Redeemed"
                  : filter === "issued"
                  ? "Issued"
                  : filter === "high"
                  ? "High Redemption"
                  : "Low Redemption"}
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Coupon</SelectItem>
                <SelectItem value="active">Active only</SelectItem>
                {/* <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="redeemed">Redeemed</SelectItem>
                <SelectItem value="issued">Issued</SelectItem> */}
                <SelectItem value="high">High Redemption</SelectItem>
                <SelectItem value="low">Low Redemption</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            placeholder="Search..."
            className="w-56"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card className="mb-6">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Brand Name</th>
                  <th className="p-3 text-left">Issued</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="p-4 text-center" colSpan={5}>
                      Loading...
                    </td>
                  </tr>
                ) : coupons?.length ? (
                  coupons.map((c) => (
                    <tr key={c._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{c.code}</td>
                      <td className="p-3">{"N/A"}</td>
                      <td className="p-3">{c.issued ? 1 : 0}</td>
                      <td className="p-3 max-w-[180px] truncate overflow-hidden text-ellipsis whitespace-nowrap">
                        {c.description}
                      </td>{" "}
                      <td className="p-3">
                        <Badge
                          className={
                            c.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200"
                          }
                        >
                          {c.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4 text-center" colSpan={5}>
                      No coupons found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {pagination && (
              <div className="flex items-center justify-end gap-3 p-3">
                {/* Prev */}
                <button
                  disabled={!pagination?.hasPrevPage}
                  onClick={() =>
                    fetchCoupons(pagination.currentPage - 1, search, filter)
                  }
                  className="
                 px-4 py-2 rounded-md border
                 text-sm font-medium
                 hover:bg-gray-100 
                 disabled:opacity-50 
                 disabled:cursor-not-allowed
               "
                >
                  Prev
                </button>

                {/* Current Page */}
                <span className="text-sm font-medium px-2">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                {/* Next */}
                <button
                  disabled={!pagination?.hasNextPage}
                  onClick={() =>
                    fetchCoupons(pagination.currentPage + 1, search, filter)
                  }
                  className="
                 px-4 py-2 rounded-md border
                 text-sm font-medium
                 hover:bg-gray-100 
                 disabled:opacity-50 
                 disabled:cursor-not-allowed
               "
                >
                  Next
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 grid grid-cols-4 gap-4 text-center text-sm">
            <div>
              <p className="font-bold text-lg">
                {analytics?.loyaltyRewards?.couponsIssued ?? "-"}
              </p>
              <p>Total Coupons Created</p>
            </div>
            <div>
              <p className="font-bold text-lg">
                {analytics?.loyaltyRewards?.couponsActive ?? "-"}
              </p>
              <p>Total Issued to Consumers</p>
            </div>
            <div>
              <p className="font-bold text-lg">
                {analytics?.loyaltyRewards?.couponsRedeemed ?? "-"}
              </p>
              <p>Total Redeemed</p>
            </div>
            <div>
              <p className="font-bold text-lg">{coupons?.[0]?.code ?? "-"}</p>
              <p>Most Popular</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

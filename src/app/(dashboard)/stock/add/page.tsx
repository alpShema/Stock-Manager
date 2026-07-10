"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import {useParams, useRouter} from "next/navigation";

export default function StockDetailPage() {
  const params = useParams();
  const id = params.add;
  
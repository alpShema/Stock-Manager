"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


import { useParams, useRouter } from "next/navigation"

export default function StockDetailPage() {
  const params = useParams()
  const add = params.add

  return (
    <p>Viewing stock item: {add}</p>
  )
}

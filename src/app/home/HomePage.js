"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useWindowSize } from "react-use"
import Confetti from "react-confetti"

import UpperSection from "../components/home/upperSection"
import LowerSection from "../components/home/lowerSection"
import Layout from "../components/LayoutHS"
import styles from "@/app/videos/videos.module.css"
import Loader from "@/app/loader/page"
import IntegrationModal from "@/app/components/integrationsModal"
import TutorialBox from "@/app/home/TutorialBox";

const Home = () => {
    const [favoredIntegrations, setFavoredIntegrations] = useState([])
    const [showIntegrationModal, setShowIntegrationModal] = useState(false)
    const [loading, setLoading] = useState(true)

    const searchParams = useSearchParams()
    const router = useRouter()
    const { width, height } = useWindowSize()
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        if (searchParams.get("payment") === "success") {
            setShowConfetti(true)

            const timer = setTimeout(() => {
                setShowConfetti(false)
                setTimeout(() => {
                    router.replace("/home", { scroll: false })
                }, 1000)
            }, 10000)

            return () => clearTimeout(timer)
        }
    }, [searchParams, router])

    useEffect(() => {
        const fetchFavoredIntegrations = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) throw new Error("User is not authenticated")

                const res = await fetch("/api/getVideosHome?page=1&limit=1", {
                    headers: { Authorization: `Bearer ${token}` },
                })

                const data = await res.json()
                const integrations = data.favoredIntegrations || []

                if (!integrations.length) {
                    setShowIntegrationModal(true)
                } else {
                    setFavoredIntegrations(integrations)
                }
            } catch (err) {
                console.error("Error checking integrations:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchFavoredIntegrations()
    }, [])

    if (loading) return <Loader />

    return (
        <Layout>
            {showConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={300}
                    recycle={false}
                />
            )}
            <TutorialBox />
            <div className={styles.divider} />
            <div style={{ marginLeft: 220 }}>
                <LowerSection />
            </div>

            <IntegrationModal
                isOpen={showIntegrationModal}
                onClose={() => setShowIntegrationModal(false)}
                onSave={(selected) => {
                    setFavoredIntegrations(selected)
                    setShowIntegrationModal(false)

                    fetch("/api/saveIntegrations", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({ integrations: selected }),
                    }).catch((error) =>
                        console.error("Error saving integrations:", error)
                    )
                }}
            />
        </Layout>
    )
}

export default Home

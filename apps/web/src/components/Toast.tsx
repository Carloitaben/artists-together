"use client"

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { motion, AnimatePresence } from "framer-motion"

import Icon from "./Icon"
import { close } from "./Icons"

type Props = {
  children: ReactNode
}

type ToastData = {
  id: string
  content: ReactNode
  duration?: number
}

type ToastContext = {
  emit: (content: ReactNode, duration?: number) => void
}

const toastContext = createContext<ToastContext | null>(null)

export default function Toast({ children }: Props) {
  const [toast, setToast] = useState<ToastData>()
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (!toast || hover) return

    const timeout = setTimeout(
      () => setToast(undefined),
      toast.duration || 5000
    )

    return () => clearTimeout(timeout)
  }, [hover, toast])

  const emit = useCallback<ToastContext["emit"]>((content, duration) => {
    const id = Math.random().toString()
    setToast({ id, content, duration })
  }, [])

  const value: ToastContext = {
    emit,
  }

  return (
    <toastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-4 bottom-4 z-50 flex justify-center">
        <AnimatePresence mode="wait">
          {toast ? (
            <motion.div
              key={toast.id}
              className="rounded-full bg-not-so-white text-sm text-gunpla-white-700 shadow-button"
              initial={{ y: "150%" }}
              animate={{ y: "0%" }}
              exit={{ y: "150%" }}
              transition={{ type: "spring", mass: 0.1 }}
              onHoverStart={() => setHover(true)}
              onHoverEnd={() => setHover(false)}
            >
              <motion.div
                className="flex items-center pl-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <p className="-translate-y-px">{toast.content}</p>
                <button onClick={() => setToast(undefined)}>
                  <Icon label="Close" className="h-12 w-12 p-4">
                    {close}
                  </Icon>
                </button>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </toastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(toastContext)

  if (!context) {
    throw Error("Used useToast outside of toastContext")
  }

  return context
}

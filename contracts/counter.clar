;; Simple Counter Smart Contract
;; This contract implements a basic counter with increment, decrement, and read functionality

;; Constants
(define-constant ERR_UNDERFLOW (err u100))
(define-constant ERR_UNAUTHORIZED (err u101))

;; Data Variables
;; Counter variable initialized to 0
(define-data-var counter uint u0)

;; Contract owner (deployer)
(define-data-var contract-owner principal tx-sender)

;; Read-only functions

;; Get the current counter value
(define-read-only (get-counter)
  (var-get counter)
)

;; Get the contract owner
(define-read-only (get-owner)
  (var-get contract-owner)
)

;; Public functions

;; Increment the counter by 1
;; Returns the new counter value
(define-public (increment)
  (let ((current-value (var-get counter)))
    (var-set counter (+ current-value u1))
    (print {
      action: "increment",
      old-value: current-value,
      new-value: (var-get counter),
      caller: tx-sender
    })
    (ok (var-get counter))
  )
)

;; Decrement the counter by 1
;; Returns error if counter would go below 0
(define-public (decrement)
  (let ((current-value (var-get counter)))
    (if (> current-value u0)
      (begin
        (var-set counter (- current-value u1))
        (print {
          action: "decrement",
          old-value: current-value,
          new-value: (var-get counter),
          caller: tx-sender
        })
        (ok (var-get counter))
      )
      ERR_UNDERFLOW
    )
  )
)

;; Reset the counter to 0
;; Only the contract owner can reset
(define-public (reset)
  (if (is-eq tx-sender (var-get contract-owner))
    (begin
      (let ((old-value (var-get counter)))
        (var-set counter u0)
        (print {
          action: "reset",
          old-value: old-value,
          new-value: u0,
          caller: tx-sender
        })
        (ok u0)
      )
    )
    ERR_UNAUTHORIZED
  )
)

;; Add a specific amount to the counter
;; Returns the new counter value
(define-public (add (amount uint))
  (let ((current-value (var-get counter)))
    (var-set counter (+ current-value amount))
    (print {
      action: "add",
      amount: amount,
      old-value: current-value,
      new-value: (var-get counter),
      caller: tx-sender
    })
    (ok (var-get counter))
  )
)

;; Subtract a specific amount from the counter
;; Returns error if counter would go below 0
(define-public (subtract (amount uint))
  (let ((current-value (var-get counter)))
    (if (>= current-value amount)
      (begin
        (var-set counter (- current-value amount))
        (print {
          action: "subtract",
          amount: amount,
          old-value: current-value,
          new-value: (var-get counter),
          caller: tx-sender
        })
        (ok (var-get counter))
      )
      ERR_UNDERFLOW
    )
  )
)

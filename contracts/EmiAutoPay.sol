// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
-----------------------------------------------------------
 FULL PRODUCTION-GRADE EMI AUTOPAY SMART CONTRACT
-----------------------------------------------------------
 - Sender sends first payment OFF-CHAIN (wallet → receiver)
 - Receiver sets EMI plan: interval, EMI amount, total amount
 - Sender deposits remaining amount into this contract
 - Chainlink Automation triggers scheduled EMI payments
 - Payments stop automatically when total target is reached
-----------------------------------------------------------
*/

contract EmiAutoPay is AutomationCompatibleInterface, ReentrancyGuard, Ownable {
    
    // --------------------------------------
    // EVENTS (Frontend will use these)
    // --------------------------------------

    event EmiPlanCreated(
        address indexed sender,
        address indexed receiver,
        uint256 emiAmount,
        uint256 interval,
        uint256 totalAmount
    );

    event DepositMade(address indexed sender, uint256 amount);
    event EmiPaid(address indexed receiver, uint256 amount, uint256 nextPaymentTime);
    event EmiCompleted(address indexed receiver);
    event EmergencyWithdraw(address indexed owner, uint256 amount);

    // --------------------------------------
    // STRUCTS & STORAGE
    // --------------------------------------

    struct EmiPlan {
        address sender;
        address receiver;
        uint256 emiAmount;
        uint256 interval;
        uint256 totalAmount;
        uint256 amountPaid;
        uint256 nextPaymentTime;
        bool isActive;
    }

    EmiPlan public plan;

    // --------------------------------------
    // CREATE EMI PLAN (Receiver sets EMI plan)
    // --------------------------------------

    function createEmiPlan(
        address _sender,
        uint256 _emiAmount,
        uint256 _interval,
        uint256 _totalAmount
    ) external {
        require(_sender != address(0), "Invalid sender");
        require(_emiAmount > 0, "EMI amount must be > 0");
        require(_interval >= 60, "Interval must be >= 60 seconds");
        require(_totalAmount > _emiAmount, "Total must be > EMI amount");

        plan = EmiPlan({
            sender: _sender,
            receiver: msg.sender,
            emiAmount: _emiAmount,
            interval: _interval,
            totalAmount: _totalAmount,
            amountPaid: 0,
            nextPaymentTime: block.timestamp + _interval,
            isActive: true
        });

        emit EmiPlanCreated(_sender, msg.sender, _emiAmount, _interval, _totalAmount);
    }

    // --------------------------------------
    // SENDER DEPOSITS FUNDS INTO CONTRACT
    // --------------------------------------

    function depositFunds() external payable nonReentrant {
        require(plan.isActive, "Plan not active");
        require(msg.sender == plan.sender, "Only sender can deposit");

        emit DepositMade(msg.sender, msg.value);
    }

    // --------------------------------------
    // CHAINLINK AUTOMATION - CHECKUPKEEP
    // --------------------------------------

    function checkUpkeep(bytes calldata) 
        external 
        view 
        override 
        returns (bool upkeepNeeded, bytes memory) 
    {
        upkeepNeeded =
            plan.isActive &&
            address(this).balance >= plan.emiAmount &&
            block.timestamp >= plan.nextPaymentTime;

        return (upkeepNeeded, "");
    }

    // --------------------------------------
    // CHAINLINK AUTOMATION - PERFORMUPKEEP
    // --------------------------------------

    function performUpkeep(bytes calldata) 
        external 
        override 
        nonReentrant 
    {
        if (
            plan.isActive &&
            address(this).balance >= plan.emiAmount &&
            block.timestamp >= plan.nextPaymentTime
        ) {
            payable(plan.receiver).transfer(plan.emiAmount);
            plan.amountPaid += plan.emiAmount;

            if (plan.amountPaid >= plan.totalAmount) {
                plan.isActive = false;
                emit EmiCompleted(plan.receiver);
                return;
            }

            plan.nextPaymentTime = block.timestamp + plan.interval;
            emit EmiPaid(plan.receiver, plan.emiAmount, plan.nextPaymentTime);
        }
    }

    // --------------------------------------
    // EMERGENCY WITHDRAW (Owner Only)
    // --------------------------------------

    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(amount);
        emit EmergencyWithdraw(owner(), amount);
    }

    // --------------------------------------
    // PUBLIC VIEW FUNCTIONS
    // --------------------------------------

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
